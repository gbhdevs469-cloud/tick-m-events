import {
  Avatar, IconButton, Badge, Popover, Box, Typography, Tooltip, Divider, List,
  ListSubheader, ListItemButton, ListItemText, Button, ListItemAvatar,
  IconButtonProps
} from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { fToNow } from 'src/utils/format-time';
import { fetchLoginActivities } from '../../redux/actions/activityActions';
import { AppDispatch } from '../../redux/store';

type NotificationItemProps = {
  id: string;
  type: string;
  location?: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

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
        <Avatar
          src={typeof avatarUrl === 'string' ? avatarUrl : undefined}
          sx={{ bgcolor: 'background.neutral' }}
        >
          {typeof avatarUrl !== 'string' ? avatarUrl : null}
        </Avatar>
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
            {fToNow(notification.postedAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

const activityIconMap: Record<string, string> = {
  'login success': '/assets/icons/notification/ic-login.png',
  'logout success': '/assets/icons/notification/ic-logout.png',
  'event_created': '/assets/icons/notification/ic-event.png',
  'profile_updated': '/assets/icons/notification/ic-profile.png',
};

export function MessagePopover({ data = [], sx, ...other }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [showAll, setShowAll] = useState(false);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));

    setNotifications(updatedNotifications);
  }, [notifications]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await dispatch(fetchLoginActivities()) as any;
        const activities = response.payload || [];
        const formatted = activities.map((item: any, idx: number) => {
          // Compute the formatted title first
          const formattedTitle = item.activityType
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase());

          // Then return the object
          return {
            id: item._id || String(idx),
            title: formattedTitle,
            location: item.location || "-",
            description:
              item.description ||
              `Activity at ${new Date(item.timestamp).toLocaleTimeString()}`,
            //  avatarUrl: '/assets/icons/notification/ic-notification-package.svg',
            avatarUrl: null, // We use `activityType` to decide avatar in renderContent
            type: item.activityType, // <== use this to drive the icon
            isUnRead: idx < 2,
            postedAt: item.timestamp || new Date(), // ✅ ADD THIS
          } as NotificationItemProps;
        });

        setNotifications(formatted);
      } catch (err) {
        console.error('Failed to fetch login activities:', err);
      }
    };

    loadNotifications();
  }, [dispatch]);

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="material-symbols:chat-outline-rounded" />
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
            <Typography variant="subtitle1">Messages Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 200, maxHeight: { xs: 360, sm: 'none' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {(showAll ? notifications : notifications.slice(0, 2)).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}

          </List>


        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            color="inherit"
            onClick={() => setShowAll(prev => !prev)}
          >
            {showAll ? 'Show less' : 'View all'}
          </Button>
        </Box>
      </Popover>
    </>
  )
}

function renderContent(notification: NotificationItemProps) {
  const iconPath =
    activityIconMap[notification.type] || '/assets/icons/notification/ic-notification-default.png';

  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
      <Typography variant="subtitle2">
        From:{notification.location}
      </Typography>
    </Typography>
  );

  return {
    avatarUrl: iconPath,
    title,
  };
}
