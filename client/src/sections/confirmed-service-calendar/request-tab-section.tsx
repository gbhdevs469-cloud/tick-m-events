import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { ConfirmedServiceCalenderTable } from "src/components/tables/confirmed-service-calender-table";

interface RequestSectionProps {
    title: string;
    headers: any[];
    data: any[];
    type: string;
}

export function RequestTabSection({
    title,
    headers,
    data,
    type,
}: RequestSectionProps) {
    return (
        <>
            <HeadingCommon variant="h5" weight={600} title={title} baseSize="26px"/>
            <ConfirmedServiceCalenderTable headers={headers} data={data} type={type} />
        </>
    );
};

