import { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { ROUTINES, useLocalContext } from '@graasp/apps-query-client';

import Uppy, { UploadResult } from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { FILE_UPLOAD_MAX_FILES } from '@/config/constants';
import { useNameFrameTranslation } from '@/config/i18n';
import { NAME_THE_FRAME } from '@/langs/constants';

import { hooks, mutations, notifier } from '../../config/queryClient';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import configureUppy from '../../utils/uppy';

type Props = {
  onUploadComplete?: () => void;
};
const { uploadAppSettingFileRoutine } = ROUTINES;
const UploadImage = ({ onUploadComplete }: Props): JSX.Element | null => {
  const { t } = useNameFrameTranslation();
  const { itemId, apiHost } = useLocalContext();
  const { data: token } = hooks.useAuthToken(itemId);
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

  const applyUppy = (): void => {
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
  };

  // update uppy configuration each time itemId changes
  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, token]);

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
        note={t(NAME_THE_FRAME.UPLOAD_IMAGE_NOTE, { FILE_UPLOAD_MAX_FILES })}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browseFiles}` is replaced with a link that opens the system file selection dialog.
            // See https://uppy.io/docs/dashboard/#locale
            dropPasteFiles: `${t(NAME_THE_FRAME.DROP_HERE)} %{browseFiles}`,
          },
        }}
      />
    </Box>
  );
};

export default UploadImage;
