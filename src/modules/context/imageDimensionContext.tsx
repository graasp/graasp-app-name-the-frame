import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { debounce } from '@/utils';

type ImageDimensionContextType = {
  imgRef: React.MutableRefObject<HTMLImageElement | null> | null;
  dimension: { width: number; height: number };
};

const ImageDimensionsContext = createContext<ImageDimensionContextType>({
  imgRef: null,
  dimension: { width: 0, height: 0 },
});

type Props = {
  children: JSX.Element;
};

// keep track of image dimension to control x,y offset for label within add labels step
export const ImageDimensionsProvider = ({ children }: Props): JSX.Element => {
  const imgRef = useRef<HTMLImageElement | null>(null);

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
    // watch image resize to save image dimension
    const onImageSizeChange = (entries: ResizeObserverEntry[]): void => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      if (width !== imgDimension.width || height !== imgDimension.height) {
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
  }, [imgRef, debouncedSaveImageDimension, imgDimension]);

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
