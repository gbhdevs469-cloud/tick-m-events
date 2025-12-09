import { Tooltip, IconButton, Card, Grid } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

export function Already({ flagData }: any) {
    return (
        <Grid container spacing={2} mt={2}>
            <Grid item xs={12} >
                <Card
                    sx={{
                        backgroundColor: '#FFD9A3',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: "12px",
                        padding: "12px",
                        border: "2px solid #ddd",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <HeadingCommon title={flagData.message} baseSize="23px" width={{ md: "34%" }} />
                    <Tooltip title={
                        <HeadingCommon color="white" title='Book another tickets' baseSize="12px" />

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