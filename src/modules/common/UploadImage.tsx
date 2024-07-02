/* eslint-disable no-console */
import { Box } from '@mui/material';

import { ROUTINES, useLocalContext } from '@graasp/apps-query-client';

import { UploadResult } from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { FILE_UPLOAD_MAX_FILES } from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { mutations, notifier } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import configureUppy from '@/utils/uppy';

import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';

type Props = {
  onUploadComplete?: () => void;
  token: string;
};

const UploadImage = ({
  onUploadComplete,
  token,
}: Props): JSX.Element | null => {
  const { t } = useAppTranslation();

  // const uppy = useUploadImage({ onUploadComplete });

  const { itemId, apiHost } = useLocalContext();
  const { mutate: onFileUploadComplete } = mutations.useUploadAppSettingFile();

  const onComplete = (result: UploadResult): boolean | void => {
    console.log(result, 'on complete');
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

  console.log(token, 'token');
  console.log(itemId, 'itemID');
  const onUpload = (): void => {
    console.log('uploading ...');
    notifier({ type: ROUTINES.uploadAppSettingFileRoutine.SUCCESS });
  };

  const onError = (error: Error): void => {
    console.log(error, 'on error');
    onFileUploadComplete({ error });
  };

  const uppy = configureUppy({
    apiHost,
    itemId,
    token,
    onComplete,
    onError,
    onUpload,
  });

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
