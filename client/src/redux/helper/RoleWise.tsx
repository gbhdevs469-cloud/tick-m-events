// src/components/ProtectedRoute.tsx
import { Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';

export type UserRole = 'organizer' | 'admin' | 'provider' | 'participant';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  currentRole?: UserRole;
}

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
  currentRole
}: ProtectedRouteProps) => {
  // Handle loading state
  if (currentRole === undefined) {
    return renderFallback;
  }

  if (!currentRole || !allowedRoles?.includes(currentRole)) {
    return <Navigate to="/404" replace />;
  }

  return <>
    {children}
  </>;
};