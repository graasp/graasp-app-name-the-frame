import React, { createContext, useContext, useMemo, useRef } from 'react';

import { AppSetting } from '@graasp/sdk';

import { Settings, SettingsKeys } from '@/@types';
import { hooks, mutations } from '@/config/queryClient';

const ImageDimensionsContext = createContext<ImageDimensionContextType>({
  imgRef: null,
  saveImageDimension: () => {},
  dimension: { width: 0, height: 0 },
});

type Props = {
  children: JSX.Element;
};

type ImageDimensionContextType = {
  saveImageDimension: (
    d: { width: number; height: number },
    id: string,
  ) => void;
  imgRef: React.MutableRefObject<HTMLImageElement | null> | null;
  dimension: { width: number; height: number };
  settingsData?: AppSetting<Settings>[];
};

export const ImageDimensionsProvider = ({ children }: Props): JSX.Element => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const value: ImageDimensionContextType = useMemo(() => {
    const data = settingsData?.[0];
    const dimension = data?.data?.imageDimension || {
      width: 0,
      height: 0,
    };

    const saveImageDimension = (
      imageDimension: {
        width: number;
        height: number;
      },
      id: string,
    ): void => {
      if (imageDimension.height && imageDimension.width) {
        const labels = settingsData?.[0]?.data.labels;
        const prevDimension = settingsData?.[0]?.data.imageDimension;

        // get new offsets in case image dimension change
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
    };

    return { imgRef, saveImageDimension, dimension, settingsData };
  }, [imgRef, patchSetting, settingsData]);

  return (
    <ImageDimensionsContext.Provider value={value}>
      {children}
    </ImageDimensionsContext.Provider>
  );
};

export const useImageDimensionsContext = (): ImageDimensionContextType =>
  useContext<ImageDimensionContextType>(ImageDimensionsContext);
