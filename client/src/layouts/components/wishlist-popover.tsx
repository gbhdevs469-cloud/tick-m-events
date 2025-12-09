import { Badge, Popover, Box, IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';

import { Iconify } from "src/components/iconify";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { AppDispatch, RootState } from "src/redux/store";
import { truncateText } from "src/hooks/description-cutting";
import { removeFromWishlist } from "src/redux/actions/event.action";



export function WishlistPopover({ sx, ...other }: any) {
    const dispatch = useDispatch<AppDispatch>();

    const { wishlist } = useSelector((state: RootState) => state?.event);
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const deleteWishListItem = async (item: any) => {
        try {
            const result = await dispatch(removeFromWishlist({ eventId: item?.eventId?._id }))
            
        } catch (error) {
            toast.error("Server maintenence");
        }
        // Add API call or state update logic
    };

    return (
        <>
            <IconButton
                color={openPopover ? 'primary' : 'default'}
                onClick={handleOpenPopover}
                sx={sx}
                {...other}
            >
                <Badge badgeContent={wishlist?.length || "0"} color="error">
                    <Iconify width={24} icon="mdi:heart" />
                </Badge>
            </IconButton>
            {
                wishlist.length ? <Popover
                    open={!!openPopover}
                    anchorEl={openPopover}
                    onClose={handleClosePopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{
                        paper: {
                            sx: {
                                marginTop: 2,
                                width: 360,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            },
                        },
                    }}
                >
                    {wishlist?.map((item: any, index: number) => (
                        <Box
                            key={item._id || index} // Use a unique identifier from your item, or fall back to index
                            display="flex"
                            alignItems="center"
                            sx={{
                                py: 2,
                                px: 2,
                                gap: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            {/* Image (80px width) */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 50,
                                    borderRadius: '2%',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                }}
                            >
                                <img
                                    src={item?.eventId?.coverImage?.url || "/path-to-profile-image.jpg"} // Use item's image if available
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>

                            {/* Name/Text Content */}
                            <Box sx={{ flexGrow: 1 }}>
                                <HeadingCommon variant="subtitle1" baseSize="15px" title={item?.eventId?.eventName || "Demo"} />
                                <HeadingCommon variant="body2" baseSize="12px" title={ReactHtmlParser(truncateText(item?.eventId?.description)) || "Followed you"} />
                            </Box>

                            {/* Remove Icon */}
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'red',
                                    '&:hover': {
                                        color: 'error.main'
                                    }
                                }}
                                onClick={() => deleteWishListItem(item)}
                            >
                                <Iconify width={24} icon="basil:cross-outline" />
                            </IconButton>
                        </Box>
                    ))}

                </Popover> : null
            }

        </>
    )
}