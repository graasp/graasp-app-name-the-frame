import { useEffect } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';

import i18n from '../../config/i18n';
import AnalyticsView from './AnalyticsView';
import BuilderView from './BuilderView';
import PlayerView from './PlayerView';

const App = (): JSX.Element => {
  const context = useLocalContext();

  useEffect(() => {
    // handle a change of language
    const lang = context?.lang ?? DEFAULT_LANG;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  switch (context.context) {
    case Context.Builder:
      return <BuilderView />;

    case Context.Analytics:
      return <AnalyticsView />;

    case Context.Player:
    default:
      return <PlayerView />;
  }
};

export default App;
