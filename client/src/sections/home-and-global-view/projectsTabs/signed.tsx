import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Paper } from "@mui/material";

import { AppDispatch, RootState } from "src/redux/store";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { getRequestsByProvider } from "src/redux/actions/service-request";

import { ContractTable } from "../contractTable";
import { contractTableHeader } from "../utills";

export function SignedTab() {
    const dispatch = useDispatch<AppDispatch>()
    const { signedReqests } = useSelector((state: RootState) => state?.serviceRequest);
    useEffect(() => {
        dispatch(getRequestsByProvider());
    }, [dispatch]);

    return (
        <Paper elevation={6}
            sx={{
                mt: 2,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
            }}>
            <HeadingCommon title="Signed Project (By Organizer)" />
            <ContractTable
                data={signedReqests}
                headers={contractTableHeader}
                type="1"
            />
        </Paper>
    )
}