import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Tab } from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { BUILDER_VIEW_CY } from '@/config/selectors';
import { APP } from '@/langs/constants';

import Configurations from '../builder/configuration/Configurations';
import BuilderResults from '../builder/results/BuilderResults';
import { LabelsProvider } from '../context/LabelsContext';

enum BuilderTabs {
  CONFIGURATION_VIEW = 'CONFIGURATION_VIEW',
  RESULTS_VIEW = 'RESULTS_VIEW',
}

const BuilderView = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(BuilderTabs.CONFIGURATION_VIEW);

  const { t } = useAppTranslation();

  return (
    <Box data-cy={BUILDER_VIEW_CY}>
      <Container>
        <TabContext value={activeTab}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={(_, newTab: BuilderTabs) => setActiveTab(newTab)}
            centered
          >
            <Tab
              value={BuilderTabs.CONFIGURATION_VIEW}
              label={t(APP.BUILDER_TAB_CONFIGURATION)}
            />
            <Tab
              value={BuilderTabs.RESULTS_VIEW}
              label={t(APP.BUILDER_TAB_RESULTS)}
            />
          </TabList>
          <TabPanel value={BuilderTabs.CONFIGURATION_VIEW}>
            <LabelsProvider>
              <Configurations />
            </LabelsProvider>
          </TabPanel>
          <TabPanel value={BuilderTabs.RESULTS_VIEW}>
            <BuilderResults />
          </TabPanel>
        </TabContext>
      </Container>
    </Box>
  );
};
export default BuilderView;
