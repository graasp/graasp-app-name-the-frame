import { Box } from '@mui/material';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { FILE_UPLOAD_MAX_FILES } from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';
import { useUploadImage } from '@/utils/hooks';

import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';

type Props = {
  itemId: string;
  token: string;
  onUploadComplete?: () => void;
};

const UploadImage = ({
  onUploadComplete,
  itemId,
  token,
}: Props): JSX.Element | null => {
  const { t } = useAppTranslation();

  const uppy = useUploadImage({ itemId, token, onUploadComplete });

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
