import type { IconButtonProps } from '@mui/material/IconButton';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { RootState, AppDispatch } from 'src/redux/store';
import { getAllNotifications, markAllRead } from 'src/redux/actions/reminderActions';

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
  eventId?: string;
  eventDetails?: {
    name?: string;
    date?: string;
    time?: string;
    location?: string;
  } | null;
};

export interface NotificationsPopoverProps extends Omit<IconButtonProps, 'children'> {
  data?: NotificationItemProps[];
}

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.reminder.notifications) as NotificationItemProps[];
  const totalUnRead = notifications.filter((item) => item.isUnRead).length;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    dispatch(getAllNotifications());
    const interval = setInterval(() => {
      dispatch(getAllNotifications());
    }, 10000); 

    return () => clearInterval(interval);
  }, [dispatch]);


  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllRead());
  }, [dispatch]);

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 2);

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {displayedNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? 'Show less' : 'View all'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {notification.postedAt && fToNow(notification.postedAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.eventDetails?.name || 'No event name'}
        {notification.eventDetails?.location && <> — {notification.eventDetails.location}</>}
        {notification.eventDetails?.time && <> @ {notification.eventDetails.time}</>}
      </Typography>
    </Typography>
  );

  const iconPath = {
    'order-placed': '/assets/icons/notification/ic-notification-package.svg',
    'order-shipped': '/assets/icons/notification/ic-notification-shipping.svg',
    mail: '/assets/icons/notification/ic-notification-mail.svg',
    'chat-message': '/assets/icons/notification/ic-notification-chat.svg',
  }[notification.type];

  return {
    avatarUrl: iconPath ? (
      <img alt={notification.title} src={iconPath} />
    ) : notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
