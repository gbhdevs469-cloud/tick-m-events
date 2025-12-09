import { Box } from '@mui/material';
import { useState } from 'react';

import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';

import { FilterGrid } from '../FilterGrid';
import { PhotoFilterSection } from '../PhotoFilterSection';
import { FrameProvider } from './FrameContext';

export function CustomPhotoAndVideoFiltersforEventsView() {
  const [sharedImage, setSharedImage] = useState<string | null>(null);

  return (
    <FrameProvider>
      <DashboardContent>
        <PageTitleSection title="Custom Photo or Video Filter" />
        <PhotoFilterSection />
        <Box mt={4}>
         <FilterGrid onShare={(img) => setSharedImage(img)}  frameSize={{ width: 400, height: 300}}  />
        </Box>
       
      </DashboardContent>
    </FrameProvider>
  );
}
