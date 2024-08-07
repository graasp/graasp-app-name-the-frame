import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Settings, SettingsKeys } from '@/@types';
import { hooks } from '@/config/queryClient';
import { debounce } from '@/utils';

type ImageDimensionContextType = {
  imgRef: React.MutableRefObject<HTMLImageElement | null> | null;
  dimension: { width: number; height: number };
};

const ImageDimensionsContext = createContext<ImageDimensionContextType>({
  imgRef: null,
  dimension: { width: 0, height: 0 },
});

type Props1 = {
  children: JSX.Element;
};
export const ImageDimensionsProvider = ({ children }: Props1): JSX.Element => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [imgDimension, setImgDimension] = useState({ width: 0, height: 0 });
  const saveImageDimension = useCallback(
    (imageDimension: { width: number; height: number }): void => {
      if (imageDimension.height && imageDimension.width) {
        setImgDimension(imageDimension);
      }
    },
    [],
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
        debouncedSaveImageDimension({ width, height });
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

  const value: ImageDimensionContextType = useMemo(() => {
    const dimension = imgDimension;

    return { imgRef, dimension };
  }, [imgRef, imgDimension]);

  return (
    <ImageDimensionsContext.Provider value={value}>
      {children}
    </ImageDimensionsContext.Provider>
  );
};

export const useImageDimensionsContext = (): ImageDimensionContextType =>
  useContext<ImageDimensionContextType>(ImageDimensionsContext);
