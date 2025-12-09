import { Typography } from "@mui/material";

export function HeadingCommon({
    title,
    variant = "subtitle2",
    color = "black",
    weight = 500,
    baseSize = "26px",
    mb, mt, width, css, textTransform = "capitalize"
}: any) {
    // Convert base size string (e.g., "26px") to number
    const baseSizeNum = parseInt(baseSize, 10);

    // Calculate responsive sizes
    const fontSize = {
        xs: `${baseSizeNum - 4}px`,  // -4px from base for xs
        sm: `${baseSizeNum - 2}px`,  // -2px from base for sm
        md: baseSize,                // Base size for md and up
    };
    return (
        <Typography
            sx={{ textTransform, ...css }}
            variant={variant}
            color={color}
            width={width}
            fontWeight={weight}
            fontSize={fontSize}
            mb={mb}
            mt={mt}
            gutterBottom
        >
            {title}
        </Typography>
    )
}