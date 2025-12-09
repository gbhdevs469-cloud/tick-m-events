import React, { useRef } from 'react';
import { Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface TopNavButtonsProps {
  active: string;
  onChange: (value: string) => void;
}

const options = [
  'Global Statistics',
  'Ticketing Activity',
  'Marketplace Activity',
  // 'Alerts & Quick Actions',
];

export function TopNavButtons({ active, onChange }: TopNavButtonsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = 150;

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        px: isMobile ? 1 : 0,
      }}
    >
      {isMobile && (
        <IconButton onClick={() => scroll('left')}>
          <ChevronLeft />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: isMobile ? 'auto' : 'unset',
          gap: 1,
          scrollBehavior: 'smooth',
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {options.map((label) => (
          <Button
            key={label}
            onClick={() => onChange(label)}
            variant="outlined"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              backgroundColor: active === label ? '#0B2E4C' : 'white',
              color: active === label ? 'white' : '#0B2E4C',
              borderColor: '#0B2E4C',
              '&:hover': {
                borderColor: '#0B2E4C',
                backgroundColor:
                  active === label ? 'rgba(6, 28, 47, 0.83)' : '#0B2E4C',
                color: 'white',
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {isMobile && (
        <IconButton onClick={() => scroll('right')}>
          <ChevronRight />
        </IconButton>
      )}
    </Box>
  );
}
