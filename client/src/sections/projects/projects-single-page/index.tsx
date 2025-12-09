import { Grid } from "@mui/material";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { DashboardContent } from "src/layouts/dashboard";
import { placeABidsByIdFetch } from "src/redux/actions/provider/Home-Global-View/freelancer.action";
import { AppDispatch, RootState } from "src/redux/store";
import { ClientInfo } from "./client-info";
import { PlaceBidOnProject } from "./place-project-bid";
import { Requirement } from "./requirement";



export default function ProjectSinglePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { projectId } = useParams();
    const { _project } = useSelector((state: RootState) => state.provider);


    useEffect(() => {
        dispatch(placeABidsByIdFetch(projectId));
    }, [dispatch, projectId]);
    return (
        <DashboardContent>
            {/* Page Layout */}
            <Grid container spacing={3}>
                {/* Left Column - Project Details */}
                <Grid item xs={12} md={8}>
                    <Requirement
                        _project={_project}
                    />

                    {/* Provider Bid Section */}
                    <PlaceBidOnProject
                        project={_project}
                    />

                </Grid>


                {/* Right Column - Client Info */}
                <Grid item xs={12} md={4} key={_project?.createdBy?._id}>
                    <ClientInfo _project={_project} />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
