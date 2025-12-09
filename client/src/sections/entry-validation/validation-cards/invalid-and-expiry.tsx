import { Card, Grid, IconButton, Tooltip } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

export function InvalidAndExpiry({ flagData }: any) {
    return (
        <Grid container spacing={2} mt={2}>
            <Grid item xs={12} >
                <Card
                    sx={{
                        backgroundColor: '#FFCCCC',
                        borderRadius: "12px",
                        padding: "12px",
                        display: 'flex',
                        justifyContent: 'space-between',
                        border: "2px solid #ddd",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <HeadingCommon title={flagData.message} baseSize="23px" width={{ md: "34%" }} />
                    <Tooltip title={
                        <HeadingCommon color="white" title="No data found in this ticket Code" baseSize="12px" />

                    } arrow>
                        <IconButton sx={{ ml: 1 }}>
                            <Iconify icon="mdi:information-outline" />
                        </IconButton>
                    </Tooltip>
                </Card>
            </Grid>
        </Grid>
    )
}