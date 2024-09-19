import React, { useEffect, useState } from 'react';

import { ROUTINES, useLocalContext } from '@graasp/apps-query-client';

import Uppy, { UploadResult } from '@uppy/core';

import { Settings, SettingsKeys } from '@/@types';
import { hooks, mutations, notifier } from '@/config/queryClient';

import configureUppy from './uppy';

export type UpdateArgument<T extends object> =
  | T
  | ((previousArg: T) => Partial<T>);

/* istanbul ignore next */
export function useObjectState<T extends object>(
  initialValue: T,
): [T, (arg: UpdateArgument<T>) => void] {
  const [state, setState] = React.useState(initialValue);

  const handleUpdate = React.useCallback((arg: UpdateArgument<T>) => {
    if (typeof arg === 'function') {
      setState((s) => {
        const newState = arg(s);

        return {
          ...s,
          ...newState,
        };
      });
    }

    if (typeof arg === 'object') {
      setState((s) => ({
        ...s,
        ...arg,
      }));
    }
  }, []);

  return [state, handleUpdate];
}

const { uploadAppSettingFileRoutine } = ROUTINES;

type Props = {
  onUploadComplete?: () => void;
  itemId: string;
  token: string;
};

export const useUploadImage = ({
  onUploadComplete,
  token,
  itemId,
}: Props): Uppy | null => {
  const { apiHost } = useLocalContext();
  const [uppy, setUppy] = useState<Uppy | null>(null);
  const { mutate: onFileUploadComplete } = mutations.useUploadAppSettingFile();

  const onComplete = (result: UploadResult): boolean | void => {
    if (!result?.failed.length) {
      onFileUploadComplete({
        data: result.successful
          ?.map(({ response }) => response?.body?.[0])
          .filter(Boolean),
      });
      onUploadComplete?.();
    }
    return false;
  };

  const onUpload = (): void => {
    notifier({ type: uploadAppSettingFileRoutine.SUCCESS });
  };

  const onError = (error: Error): void => {
    onFileUploadComplete({ error });
  };

  // update uppy configuration each time itemId changes
  useEffect(() => {
    if (typeof token !== 'undefined') {
      setUppy(
        configureUppy({
          apiHost,
          itemId,
          token,
          onComplete,
          onError,
          onUpload,
        }),
      );
    }

    return () => {
      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return uppy;
};

// mapping between Setting names and their data type
// eslint-disable-next-line @typescript-eslint/ban-types
type AllSettingsType = {
  [SettingsKeys.Settings]: Settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [SettingsKeys.File]: any;
};
type AllSettingsNameType = SettingsKeys;
type AllSettingsDataType = AllSettingsType[keyof AllSettingsType];
export const saveSettings = (
  name: AllSettingsNameType,
  newValue: AllSettingsDataType,
): void => {
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const { data: appSettingsList } = hooks.useAppSettings();

  if (appSettingsList) {
    const previousSetting = appSettingsList.find((s) => s.name === name);
    // setting does not exist
    if (!previousSetting) {
      postAppSetting({
        data: newValue,
        name,
      });
    } else {
      patchAppSetting({
        id: previousSetting.id,
        data: newValue,
      });
    }
  }
};
