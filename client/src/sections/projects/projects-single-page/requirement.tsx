import {
    Box, Typography, Chip, Grid, Paper, Divider, Stack,
    TextField, MenuItem, Button
} from "@mui/material";
import { ProjectDetailsTab } from "./projectDetailsTab";

export function Requirement({ _project }: any) {
    return (
        <Paper sx={{
            p: 3,
            borderRadius: 2,
            border: '3px solid #2395D4',

        }}>
            {/* Title & Status */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
            >
                {/* Left Content */}
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                        {_project.eventId?.eventName}
                    </Typography>
                    <Typography variant="body2" color="gray" >
                        Event Location : {_project?.eventLocation}
                    </Typography>
                </Box>

                {/* Right Content */}
                <Box sx={{
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label={_project?.bidStatus}
                            color={_project?.bidStatus === "closed" ? "error" : "success"}
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                        />
                        {_project?.isSigned && (
                            <Chip
                                label="Signed"
                                color="primary"
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                            />
                        )}
                    </Box>

                    <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                        Avg Bid Amount : {_project.avgBidAmount} XAF
                    </Typography>
                </Box>
            </Stack>

           <hr />
            <ProjectDetailsTab _project={_project} />
        </Paper>
    )
}