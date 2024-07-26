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
      const payload = {
        ...settingsData?.[0]?.data,
        imageDimension,
      };
      patchSetting({ id, data: payload });
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
