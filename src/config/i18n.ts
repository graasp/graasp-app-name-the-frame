import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n from '@graasp/translations';

import en from '../langs/en.json';
import fr from '../langs/fr.json';

const i18n = buildI18n().use(initReactI18next);

export const NAME_THE_FRAME_NAMESPACE = 'name_the_frame';

i18n.addResourceBundle('en', NAME_THE_FRAME_NAMESPACE, en);
i18n.addResourceBundle('fr', NAME_THE_FRAME_NAMESPACE, fr);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useNameFrameTranslation = () =>
  useTranslation(NAME_THE_FRAME_NAMESPACE);

export const DEFAULT_LANGUAGE = 'en';
export default i18n;
