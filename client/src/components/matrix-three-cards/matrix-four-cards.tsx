import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import { HeadingCommon } from "../multiple-responsive-heading/heading";

export function MatrixFourCard({ metrics }: any) {
    return (
        <Grid container spacing={2}>
            {
                metrics?.map((metric: any, index: any) => (
                    <Grid item xs={12} sm={3} md={3} key={index} sx={{ textAlign: "center" }}>
                        <Card sx={{
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: 3,
                            transition: "box-shadow 0.3s ease",
                            bgcolor: "#1E8ECC66" // Smooth transition
                        }}>
                            
                            <Box sx={{ fontSize: 40,fontWeight: "bold"  }}>
                                {metric.icon}
                            </Box>
                            <HeadingCommon title={metric.title} color="#000000" baseSize="20px" sx={{ fontWeight: "bold" }} />   
                        </Card>
                    </Grid>
                ))
            }
        </Grid>
    );
}
