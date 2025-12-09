import { Card, Grid, Box } from "@mui/material";

export function BannerGallery({ coverImage, portraitImage }: any) {
    return (
        <Grid container spacing={3}>
            {/* Main Banner */}
            <Grid item xs={12} md={8}>
                <Card
                    sx={{
                        height: "330px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        borderRadius: "15px",
                        p: 0, // Remove padding to let image fill the card
                        overflow: "hidden", // Ensure image stays within card bounds
                        position: "relative",
                    }}
                >
                    <Box
                        component="img"
                        src={coverImage?.url || "../assets/images/cover/banner-1.png"}
                        alt="Cover"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // or use "contain" to see full image without cropping
                            objectPosition: "center",
                            display: "block",
                        }}
                    />
                    {/* Optional overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
                        }}
                    />
                </Card>
            </Grid>

            {/* Side Gallery */}
            <Grid item xs={12} md={4}>
                <Card
                    sx={{
                        height: "330px",
                        borderRadius: "15px",
                        p: 0,
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Box
                        component="img"
                        src={portraitImage?.url || "../assets/images/cover/banner-2.png"}
                        alt="Portrait"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // or use "contain" to see full image without cropping
                            objectPosition: "center",
                            display: "block",
                        }}
                    />
                    {/* Optional overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
                        }}
                    />
                </Card>
            </Grid>
        </Grid>
    );
}