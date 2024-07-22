import { useContext, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import {
  ROUTINES,
  TokenContext,
  useLocalContext,
} from '@graasp/apps-query-client';

import Uppy, { UploadResult } from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { FILE_UPLOAD_MAX_FILES } from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { mutations, notifier } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import configureUppy from '@/utils/uppy';

import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';

const { uploadAppSettingFileRoutine } = ROUTINES;
type Props = {
  onUploadComplete?: () => void;
};

const UploadImage = ({ onUploadComplete }: Props): JSX.Element | null => {
  const { t } = useAppTranslation();

  const { itemId, apiHost } = useLocalContext();
  const token = useContext(TokenContext);
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

  if (!uppy) {
    return null;
  }

  return (
    <Box id={DASHBOARD_UPLOADER_ID}>
      <Dashboard
        uppy={uppy}
        height={400}
        width="100%"
        proudlyDisplayPoweredByUppy={false}
        note={t(APP.UPLOAD_IMAGE_NOTE, { FILE_UPLOAD_MAX_FILES })}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browseFiles}` is replaced with a link that opens the system file selection dialog.
            // See https://uppy.io/docs/dashboard/#locale
            dropPasteFiles: `${t(APP.DROP_HERE)} %{browseFiles}`,
          },
        }}
      />
    </Box>
  );
};

export default UploadImage;
