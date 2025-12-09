import { Card, CardContent, Grid, Typography, Button, Stack } from "@mui/material"


export function MatrixOneCard({ metrics }: any) {
    return (
        <Grid container spacing={2} mt={2}>
            {
                metrics?.map((metric: any, index: any) => (
                    <Grid item xs={12} sm={12} md={12} key={index} sx={{ textAlign: "center" }}>
                        <Card sx={{
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: 3,
                            transition: "box-shadow 0.3s ease", // Smooth transition
                            backgroundColor: "#2295D4",
                            color: "#fffff",
                            textAlign: "center",
                        }}>
                            <CardContent>
                                <Typography
                                    variant="subtitle2"
                                    color="#fff"
                                    fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
                                    fontWeight={400}
                                >
                                    {metric.title}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color="#fff"
                                    fontWeight={800}
                                    fontSize={{ xs: "18px", sm: "20px", md: "22px" }}
                                >
                                    {metric.value}
                                </Typography>
                                <Stack direction="row" spacing={2} justifyContent="center" mt={1} mb={1}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#fff",
                                            color: "#2295D4",
                                            fontWeight: "bold",
                                            borderRadius: "12px",
                                            textTransform: "none",
                                            px: 3,
                                            '&:hover': {
                                                backgroundColor: "#f0f0f0",
                                            }
                                        }}
                                    >
                                        Top Up
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#fff",
                                            color: "#2295D4",
                                            fontWeight: "bold",
                                            borderRadius: "12px",
                                            textTransform: "none",
                                            px: 3,
                                            '&:hover': {
                                                backgroundColor: "#f0f0f0",
                                            }
                                        }}
                                    >
                                        Withdraw
                                    </Button>
                                </Stack>
                                <Typography
                                    variant="h4"
                                    color="#fff"
                                    fontWeight={600}
                                    fontSize={{ xs: "14px", sm: "16px", md: "17px" }}
                                >
                                    Transaction History :
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color="#fff"
                                    fontWeight={600}
                                    fontSize={{ xs: "13px", sm: "14px", md: "15px" }}
                                >
                                    {metric.topUp}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color="#fff"
                                    fontWeight={600}
                                    fontSize={{ xs: "13px", sm: "14px", md: "15px" }}
                                >
                                    {metric.tickCommission}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }
            {/* <Grid item xs={12} sm={12} md={12}>
                <Card sx={{
                    height: "90%",
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 2,
                    backgroundColor: "#fff",
                    color: "#333",
                    textAlign: "left"
                }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#2295D4"
                            gutterBottom
                        >
                            Ongoing Projects
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={400}
                            color="#000"
                        >
                            No active projects at the moment.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid> */}
        </Grid>


    )

}