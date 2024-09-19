import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Tab } from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { BUILDER_VIEW_CY, buildBuilderTabClassName } from '@/config/selectors';
import { APP } from '@/langs/constants';

import Configurations from '../builder/configuration/Configurations';
import BuilderResults from '../builder/results/BuilderResults';
import { BuilderTab } from './BuilderTab';

const BuilderView = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(BuilderTab.Configuration);

  const { t } = useAppTranslation();

  return (
    <Box data-cy={BUILDER_VIEW_CY}>
      <Container>
        <TabContext value={activeTab}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={(_, newTab: BuilderTab) => setActiveTab(newTab)}
            centered
          >
            <Tab
              className={buildBuilderTabClassName(BuilderTab.Configuration)}
              value={BuilderTab.Configuration}
              label={t(APP.BUILDER_TAB_CONFIGURATION)}
            />
            <Tab
              className={buildBuilderTabClassName(BuilderTab.Results)}
              value={BuilderTab.Results}
              label={t(APP.BUILDER_TAB_RESULTS)}
            />
          </TabList>
          <TabPanel value={BuilderTab.Configuration}>
            <Configurations />
          </TabPanel>
          <TabPanel value={BuilderTab.Results}>
            <BuilderResults />
          </TabPanel>
        </TabContext>
      </Container>
    </Box>
  );
};
export default BuilderView;
