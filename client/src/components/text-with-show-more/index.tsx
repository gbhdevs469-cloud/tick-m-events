import { useState } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export function TextWithShowMore({ text, wordLimit = 70 }: any) {
    const [expanded, setExpanded] = useState(false);

    // Split text into words
    const words = text?.split(/\s+/) || [];
    const shouldTruncate = words.length > wordLimit;
    const displayText = expanded ? text : words.slice(0, wordLimit).join(' ');

    return (
        <Box>
            <Typography variant="body2" paragraph
                dangerouslySetInnerHTML={{ __html: displayText }}
            />
            {shouldTruncate && (
                <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                        ml: -1,
                        color: 'text.secondary'
                    }}
                >
                    {expanded ? (
                        <ExpandLessIcon fontSize="small" />
                    ) : (
                        <ExpandMoreIcon fontSize="small" />
                    )}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {expanded ? 'Show Less' : 'Show More'}
                    </Typography>
                </IconButton>
            )}
        </Box>
    );
};