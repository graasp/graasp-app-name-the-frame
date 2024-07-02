import React, { createContext, useContext, useMemo, useRef } from 'react';

const ImageDimensionsContext = createContext<ImageDimensionContextType>({
  imgRef: null,
});

type Props = {
  children: JSX.Element;
};

type ImageDimensionContextType = {
  imgRef: React.MutableRefObject<HTMLImageElement | null> | null;
};
export const ImageDimensionsProvider = ({ children }: Props): JSX.Element => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const value: ImageDimensionContextType = useMemo(
    () => ({ imgRef }),
    [imgRef],
  );

  return (
    <ImageDimensionsContext.Provider value={value}>
      {children}
    </ImageDimensionsContext.Provider>
  );
};

export const useImageDimensionsContext = (): ImageDimensionContextType =>
  useContext<ImageDimensionContextType>(ImageDimensionsContext);
