import { Box,Button, Divider, IconButton, Typography } from "@mui/material";

import { Iconify } from "src/components/iconify";

export function NavHomeTwo() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#0C2E4E',
            color: "white",
            py: 1
        }}>
            <Box sx={{ textAlign: 'center', display: "flex", alignItems: "center" }} gap={3}>
                <Box display="flex" alignItems="center">
                    <IconButton sx={{ color: "primary" }}>
                        <Iconify width={20} icon="ion:call" />
                    </IconButton>
                    <Typography variant="body2">+1 222-5553-33-99</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <IconButton sx={{ color: "primary" }}>
                        <Iconify width={20} icon="ic:outline-email" />
                    </IconButton>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Sales@cammo.com</Typography>

                </Box>

            </Box>
            <Box sx={{ textAlign: 'center', display: "flex", alignItems: "center" }} gap={3}>
                <Typography variant="body2">More than 800+ special collection  in this summer</Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Access Now</Typography>
                    <IconButton sx={{ color: "primary" }}>
                        <Iconify width={20} icon="humbleicons:arrow-right" />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'center', display: "flex", alignItems: "center" }} gap={3}>
                <Box display="flex" alignItems="center">
                    <IconButton sx={{ color: "primary" }}>
                        <Iconify width={20} icon="iconoir:globe" />
                    </IconButton>
                    <Typography variant="caption">EN</Typography>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ borderRightWidth: "medium", borderColor: "white" }} />
                <Box display="flex" alignItems="center">
                    <Typography variant="caption">USD</Typography>
                    <IconButton sx={{ color: "primary" }}>
                        <Iconify width={20} icon="iconamoon:arrow-down-2-light" />
                    </IconButton>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ borderRightWidth: "medium", borderColor: "white" }} />

                <Button variant="contained" sx={{ borderRadius: "25px", textTransform: 'none', color: "#0C2E4E", backgroundColor: "white" }}>
                    Become Seller
                </Button>
            </Box>

        </Box>
    )
}