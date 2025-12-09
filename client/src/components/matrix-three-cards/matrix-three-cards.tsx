import { Card, CardContent, Grid, Button } from "@mui/material";
import { HeadingCommon } from "../multiple-responsive-heading/heading";

export function MatrixThreeCard({ metrics, md = 4, sm = 4, onCardButtonClick }: any) {
    return (
        <Grid container spacing={2} mt={2}>
            {metrics?.map((metric: any, index: any) => (
                <Grid item xs={12} sm={sm} md={md} key={index} sx={{ textAlign: "center" }}>
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: 3,
                            transition: "box-shadow 0.3s ease",
                        }}
                    >
                        <CardContent>
                            <HeadingCommon title={metric.title} variant="h4" baseSize="26px" />
                            <HeadingCommon title={metric.value} color="#2295D4" baseSize="26px" />

                            {metric.buttonType && metric.value > 0 && (
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    color="primary"
                                    onClick={() => onCardButtonClick(metric.buttonType)}
                                >
                                    View {metric.buttonType === 'active' ? 'Active Contracts' : 'Completed Projects'}
                                </Button>
                            )}


                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
