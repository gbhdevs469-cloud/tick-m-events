import { Box, InputBase, IconButton } from "@mui/material";
import { Iconify } from "src/components/iconify";

export function SearchBar() {
    return (
        <Box
            sx={{
                display: "flex",
                height: "40px",
                alignItems: "center",
                width: { xs: "150px", sm: "180px", md: "200px" },
                maxWidth: "300px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px 12px",
                backgroundColor: "#fff",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
        >
            <IconButton >
                <Iconify icon="eva:search-fill" />
            </IconButton>
            <InputBase
                placeholder="Search here"
                sx={{
                    flex: 1,
                    fontSize: "14px",
                    color: "#666",
                    "&::placeholder": { color: "#bbb" },
                }}
            />
        </Box>
    )
}