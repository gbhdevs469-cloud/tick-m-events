import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

export function FriendWhoBooked() {
    const friends = ["Alice W.", "John D.", "Emma R.", "Michael S."];


    return (
        < Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 3, backgroundColor: "#EEEEEE" }
        }>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Friends Who Booked
            </Typography>
            <Grid container spacing={2}>
                {friends.map((friend, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: "white",
                            }}
                        >
                            <Typography>{friend}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Paper >

    )
}