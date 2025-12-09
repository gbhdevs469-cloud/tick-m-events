import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";

interface SelectBarProps {
    title: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (event: any) => void;
}

export function SelectBar({ title, options, value, onChange }: SelectBarProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" }, fontWeight: "500" }}>
                {title}:
            </Typography>
            <FormControl sx={{ minWidth: 120 }}>
                <Select value={value} onChange={onChange} size="small">
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
