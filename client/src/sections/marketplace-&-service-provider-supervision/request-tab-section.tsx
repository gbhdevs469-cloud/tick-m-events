import { Typography, Box, Button, Select, MenuItem } from "@mui/material";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { MarketplaceAndServiceProviderSupervisionTable } from "src/components/tables/marketplace-&-service-provider-supervision-table";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <Box display="flex" mb={1}>
            <Typography fontWeight="bold" minWidth={145}>
                {label}:
            </Typography>
            <Typography sx={{ fontSize: "15px", fontWeight: "600", marginLeft: 2, }}>{value}</Typography>
        </Box>
    );
}

interface RequestSectionProps {
    title: string;
    description: string;
    headers: any[];
    data: any[];
    type: string;
    detailsTitle?: string;
    details?: { label: string; value: string }[];
    buttons?: {
        label: string;
        variant: "contained" | "outlined";
        onClick?: () => void;
    }[];
    filterOptions?: string[]; // <-- add this
    selectedFilter?: string;  // <-- add this
    onFilterChange?: (value: string) => void; // <-- add this
}

export function RequestTabSection({
    title,
    description,
    headers,
    data,
    type,
    detailsTitle,
    details,
    buttons,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange

}: RequestSectionProps) {
    return (
        <>
            <HeadingCommon variant="h6" title={title} weight={600} baseSize="34px" />
            <Typography variant="body2" mb={2}>
                {description}
            </Typography>
            {filterOptions.length > 0 && (
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Select
                        value={selectedFilter}
                        onChange={(e) => onFilterChange?.(e.target.value)}
                        IconComponent={ArrowDropDownIcon}
                        variant="standard"
                        disableUnderline
                        sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#6B7280", // grey text
                            minWidth: "60px",    
                            backgroundColor: "transparent",
                            '& .MuiSelect-select': {
                                padding: '4px 24px 4px 0px',
                            },
                            '& .MuiSvgIcon-root': {
                                color: "#6B7280", // grey arrow
                                marginLeft: "4px",
                            },
                            '&:hover': {
                                backgroundColor: "transparent"
                            },
                        }}
                    >
                        {filterOptions.map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}

            <MarketplaceAndServiceProviderSupervisionTable headers={headers} data={data} type={type} />

            {details && (
                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                    <Box
                        sx={{
                            borderRadius: 4,
                            p: 4,
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.15)",
                            maxWidth: 600,
                            width: "100%"
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            {detailsTitle}
                        </Typography>

                        <Box>
                            {details.map((item, i) => (
                                <Detail key={i} label={item.label} value={item.value} />
                            ))}
                        </Box>

                        {buttons && (
                            <Box display="flex" gap={2} mt={4} justifyContent="flex-end">
                                {buttons.map((btn, idx) => (
                                    <Button
                                        key={idx}
                                        variant={btn.variant}
                                        onClick={btn.onClick}
                                        sx={{
                                            backgroundColor: btn.variant === "contained" ? "#0B2647" : undefined,
                                            color: btn.variant === "outlined" ? "#0B2647" : undefined,
                                            borderColor: btn.variant === "outlined" ? "#0B2647" : undefined,
                                            textTransform: "none",
                                            borderRadius: 2,
                                            px: 3,
                                            "&:hover": {
                                                backgroundColor: btn.variant === "contained" ? "#081c34" : undefined,
                                                borderColor: btn.variant === "outlined" ? "#081c34" : undefined,
                                                color: btn.variant === "outlined" ? "#081c34" : undefined
                                            }
                                        }}
                                    >
                                        {btn.label}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

