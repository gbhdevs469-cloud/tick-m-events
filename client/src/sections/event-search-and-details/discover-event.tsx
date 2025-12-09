import { Grid } from "@mui/material";
import { PopularEvent } from "../home-and-recommendations/PopularEvent";

export function DiscoverEvent({ list }: any) {
    return (
        <Grid container spacing={3} >
            {list?.slice(0,2).map((ticketc: any, index: any) => (
                <Grid item xs={12} sm={6} md={6} key={ticketc.id || index}>
                    <PopularEvent event={ticketc} key={index} />
                </Grid>
            ))}
        </Grid>
    )
}