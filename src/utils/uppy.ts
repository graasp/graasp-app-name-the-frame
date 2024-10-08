import Uppy, {
  ErrorCallback,
  FileAddedCallback,
  FilesAddedCallback,
  ProgressCallback,
  UploadCallback,
  UploadCompleteCallback,
} from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';

import { API_ROUTES } from '../config/queryClient';

interface UppyConfiguration {
  apiHost: string;
  itemId: string;
  token: string;
  // TODO: define the correct types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onComplete: UploadCompleteCallback<any>;
  onProgress?: ProgressCallback;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileAdded?: FileAddedCallback<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilesAdded?: FilesAddedCallback<any>;
  onError: ErrorCallback;
  onUpload: UploadCallback;
}

const configureUppy = ({
  apiHost,
  itemId,
  token,
  onComplete,
  onProgress,
  onFileAdded,
  onFilesAdded,
  onError,
  onUpload,
}: UppyConfiguration): Uppy => {
  const uppy = new Uppy({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'], // Allow only images
    },
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    endpoint: `${apiHost}/${API_ROUTES.buildUploadAppSettingFilesRoute(itemId)}`,
    withCredentials: true,
    formData: true,
    allowedMetaFields: [],
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  uppy.on('file-added', (file) => {
    onFileAdded?.(file);
  });

  uppy.on('files-added', (files) => {
    onFilesAdded?.(files);
  });

  uppy.on('upload', onUpload);

  if (onProgress) {
    uppy.on('progress', onProgress);
  }

  uppy.on('complete', (result) => {
    onComplete?.(result);
  });

  if (onError) {
    uppy.on('error', onError);
    uppy.on('upload-error', (_, error) => {
      onError(error);
    });
  }

  return uppy;
};

export default configureUppy;
