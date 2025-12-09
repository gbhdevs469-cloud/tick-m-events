import { styled } from "@mui/material/styles";
import { AppBar,Box, Button, Toolbar } from "@mui/material";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottom: "1px solid black"
}));

const NavItems = styled(Box)({
    display: "flex",
    gap: "24px",
});

export function NavHomeOne() {
    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper" }}>
            <StyledToolbar>
                <Box
                    alt="Single logo"
                    component="img"
                    src="../assets/logo/logo-mobile.png"
                    width="150px"
                    height="70px"
                    style={{ objectFit: "cover" }}
                />

                <NavItems>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">About Us</Button>
                    <Button color="inherit">Sell Your Event</Button>
                    <Button color="inherit">Advertise Your Event</Button>
                    <Button color="inherit">Contact</Button>
                </NavItems>
                <Box>
                    Create YOur Event
                </Box>
            </StyledToolbar>
        </AppBar>
    )
}