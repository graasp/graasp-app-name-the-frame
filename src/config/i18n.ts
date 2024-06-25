import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n from '@graasp/translations';

import en from '../langs/en.json';
import fr from '../langs/fr.json';

const i18n = buildI18n().use(initReactI18next);

export const APP_NAMESPACE = 'name_the_frame';

i18n.addResourceBundle('en', APP_NAMESPACE, en);
i18n.addResourceBundle('fr', APP_NAMESPACE, fr);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAppTranslation = () => useTranslation(APP_NAMESPACE);

export default i18n;
