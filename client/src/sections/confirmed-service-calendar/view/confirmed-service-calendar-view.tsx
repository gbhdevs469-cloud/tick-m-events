import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { AppDispatch, RootState } from "src/redux/store";
import { DashboardContent } from "src/layouts/dashboard";
import { MatrixThreeCard } from "src/components/matrix-three-cards/matrix-three-cards";
import { getRequestsByProvider } from "src/redux/actions/service-request";

import { TabWithTableView } from "../tab-with-table";

export function ConfirmedServiceCalendarView() {
    const { completedRequests, signedReqests, allActiveProjects } =
        useSelector((state: RootState) => state?.serviceRequest);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getRequestsByProvider());
    }, [dispatch]);

    // -----------------------------------
    // 🔥 SPLIT DATA BY PROJECT TYPE
    // -----------------------------------
    const eventReqProjects = allActiveProjects?.filter(
        (item :any) => item.projectType === "EventReq"
    );

    const bidProjects = allActiveProjects?.filter(
        (item: any) => item.projectType === "Bid"
    );

    const stats = [
        { title: "Confirmed Requests", value: eventReqProjects?.length || 0 },
        { title: "Confirmed Bids", value: bidProjects?.length || 0 },
    ];

    return (
        <DashboardContent>
            <MatrixThreeCard metrics={stats} />
            <TabWithTableView />
        </DashboardContent>
    );
}
