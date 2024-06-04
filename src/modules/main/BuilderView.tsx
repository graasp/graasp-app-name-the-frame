import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Tab } from '@mui/material';

import { useNameFrameTranslation } from '@/config/i18n';
import { BUILDER_VIEW_CY } from '@/config/selectors';
import { NAME_THE_FRAME } from '@/langs/constants';

import Configurations from '../builderView/configuration';

enum BuilderTabs {
  CONFIGURATION_VIEW = 'CONFIGURATION_VIEW',
}

const BuilderView = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(BuilderTabs.CONFIGURATION_VIEW);

  const { t } = useNameFrameTranslation();

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
              label={t(NAME_THE_FRAME.BUILDER_TAB_CONFIGURATION)}
            />
          </TabList>
          <TabPanel value={BuilderTabs.CONFIGURATION_VIEW}>
            <Configurations />
          </TabPanel>
        </TabContext>
      </Container>
    </Box>
  );
};
export default BuilderView;
