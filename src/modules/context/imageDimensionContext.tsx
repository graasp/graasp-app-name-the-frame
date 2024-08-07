import React, { useCallback, useEffect, useMemo } from 'react';

import { Settings, SettingsKeys } from '@/@types';
import { hooks, mutations } from '@/config/queryClient';
import { debounce } from '@/utils';

type Props = {
  imgRef: React.MutableRefObject<HTMLImageElement | null> | null;
};
export const useImageObserver = ({ imgRef }: Props): void => {
  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const saveImageDimension = useCallback(
    (
      imageDimension: {
        width: number;
        height: number;
      },
      id: string,
    ): void => {
      if (imageDimension.height && imageDimension.width) {
        const labels = settingsData?.[0]?.data.labels;
        const prevDimension = settingsData?.[0]?.data.imageDimension;

        // Calculate new offsets if image dimensions have changed
        const newLabels = labels?.map((label) => {
          const { x, y } = label;
          if (
            prevDimension &&
            (prevDimension.width !== imageDimension.width ||
              prevDimension?.height !== imageDimension.height)
          ) {
            const newX = (x * imageDimension.width) / prevDimension.width;
            const newY = (y * imageDimension.height) / prevDimension.height;
            return { ...label, x: newX, y: newY };
          }
          return label;
        });

        const payload = {
          ...settingsData?.[0]?.data,
          imageDimension,
          labels: newLabels,
        };

        patchSetting({ id, data: payload });
      }
    },
    [settingsData, patchSetting],
  );

  const debouncedSaveImageDimension = useMemo(
    () => debounce(saveImageDimension, 200),
    [saveImageDimension],
  );

  useEffect((): (() => void) => {
    const data = settingsData?.[0];
    const dimension = data?.data?.imageDimension || {
      width: 0,
      height: 0,
    };
    // watch image resize to save image dimension
    const id = settingsData?.[0]?.id;
    const onImageSizeChange = (entries: ResizeObserverEntry[]): void => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      if ((width !== dimension.width || height !== dimension.height) && id) {
        debouncedSaveImageDimension({ width, height }, id);
      }
    };

    const resizeObserver = new ResizeObserver(onImageSizeChange);
    if (imgRef?.current) {
      resizeObserver.observe(imgRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [imgRef, debouncedSaveImageDimension, settingsData]);
};
