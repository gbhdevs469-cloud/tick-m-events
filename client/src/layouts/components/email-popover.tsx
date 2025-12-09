import { IconButton,Badge } from "@mui/material";
import { useCallback, useState } from "react";
import { Iconify } from "src/components/iconify";

export function EmailPopover({ totalUnRead, sx, ...other}: any) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);
    return (
        <>
            <IconButton
                color={openPopover ? 'primary' : 'default'}
                onClick={handleOpenPopover}
                sx={sx}
                {...other}
            >
                <Badge badgeContent={totalUnRead} color="error">
                    <Iconify width={24} icon="line-md:email" />
                </Badge>
            </IconButton>
        </>
    )
}