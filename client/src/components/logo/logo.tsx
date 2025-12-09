import type { BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme, useMediaQuery } from '@mui/material';

import { RouterLink } from 'src/routes/components';
import { logoClasses } from './classes';
import logoMobile from '../../../public/assets/logo/logo-mobile.png';
import fullLogoImg from '../../../public/assets/logo/full-logo.png';
// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  disableLink?: boolean;
  singleLogoPath?: string;
  fullLogoPath?: string;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { 
      width, 
      href = '/', 
      height, 
      disableLink = false, 
      className, 
      sx, 
      singleLogoPath = logoMobile,
      fullLogoPath = fullLogoImg,
      ...other 
    },
    ref
  ) => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={singleLogoPath}
        width="59px"
        height="41px"
        style={{ objectFit: "cover" }}
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={fullLogoPath}
        width="200px"
        height="90px"
        style={{ objectFit: "scale-down" }}
      />
    );

    const baseSize = {
      width: width ?? (isMdUp ? 122 : 102),
      height: height ?? (isMdUp ? 81 : 36),
    };

    return (
      <Box
        ref={ref}
        component={disableLink ? 'div' : RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isMdUp ? fullLogo : singleLogo}
      </Box>
    );
  }
);