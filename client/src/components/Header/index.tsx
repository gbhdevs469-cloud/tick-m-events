import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";


export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { authenticate } = useSelector((state: RootState) => state?.auth);
  const navigate = useNavigate()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <List>
        {[
          { text: "Home", path: "/home" },
          { text: "Events", path: "/event-list" },
          { text: "Blog", path: "#" },
          { text: "B2B Marketplace", path: "#" },
          { text: "About", path: "/about-us" },
          { text: "Contact", path: "/contact-us" },
        ].map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <header>
      {/* 🔹 Main Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "black",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "70px !important",
            px: { xs: 2, md: 8 },
          }}
        >
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1}>
            <Link to="/home">
              <img
                src="/assets/logo/full-logo.png"
                alt="Logo"
                style={{ height: 50, cursor: "pointer" }}
              />
            </Link>
          </Box>

          {/* Menu (desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  fontWeight: 600,
                  '&:hover': {
                    color: "#0d2a4d",
                  }
                }}
              >
                Home
              </Typography>
            </Link>

            <Link to="/event-list" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  '&:hover': {
                    color: "#0d2a4d",
                  }
                }}
              >
                Events
              </Typography>
            </Link>

            <Link to="#" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  '&:hover': {
                    color: "#0d2a4d",
                  }
                }}
              >
                Blog
              </Typography>
            </Link>

            <Link to="#" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  '&:hover': {
                    color: "#0d2a4d",
                  }
                }}
              >
                B2B Marketplace
              </Typography>
            </Link>

            <Link to="/about-us" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  '&:hover': {
                    color: "#0d2a4d",
                  }
                }}
              >
                About
              </Typography>
            </Link>

            <Link to="/contact-us" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  '&:hover': {
                    color: "#0d2a4d",
                  }
                }}
              >
                Contact
              </Typography>
            </Link>
          </Box>

          {/* Right Controls */}
          <Box display="flex" alignItems="center" gap={1}>
            {
              authenticate ? (
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    color: "#0d2a4d",
                    fontSize: { xs: "10px", sm: "12px" },
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    minWidth: "auto",
                    border: "1px solid #0d2a4d",
                    '&:hover': {
                      backgroundColor: "#0d2a4d",
                      color: "white",
                    },
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Link to="/sign-in" style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      color: "#0d2a4d",
                      fontSize: { xs: "10px", sm: "12px" },
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      minWidth: "auto",
                      border: "1px solid #0d2a4d",
                      '&:hover': {
                        backgroundColor: "#0d2a4d",
                        color: "white",
                      },

                    }}
                  >
                    <PersonIcon fontSize="small" /> Sign In
                  </Button>
                </Link>
              )
            }



            {/* Language Selector */}
            {/* <Box display="flex" alignItems="center" gap={0.5}>
              <LanguageIcon sx={{ fontSize: 16, color: "#0d2a4d" }} />
              <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                size="small"
                sx={{
                  fontSize: "12px",
                  height: 28,
                  color: "#0d2a4d",
                  "& .MuiSelect-icon": { color: "#0d2a4d" },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                variant="outlined"
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="fr">FR</MenuItem>
              </Select>
            </Box> */}

            {/* Hamburger menu (mobile only) */}
            <IconButton
              edge="end"
              color="inherit"
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#0d2a4d"
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: "none" } }}
      >
        {drawer}
      </Drawer>
    </header>
  );
}