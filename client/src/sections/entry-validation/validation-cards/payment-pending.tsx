import { Grid, Card, Tooltip, IconButton } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

export function PaymentPending({ flagData }: any) {
    return (
        <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
                <Card
                    sx={{
                        backgroundColor: '#FFF3CD',
                        borderRadius: "12px",
                        padding: "12px",
                        border: "2px solid #ddd",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <HeadingCommon
                        title={flagData.message}
                        baseSize="23px"
                        color="orange"
                    />
                    <Tooltip title={
                        <HeadingCommon
                            color="white"
                            title="Payment must be completed before entry"
                            baseSize="12px"
                        />
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