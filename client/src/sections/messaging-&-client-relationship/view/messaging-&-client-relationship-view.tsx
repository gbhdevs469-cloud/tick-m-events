import { DashboardContent } from "src/layouts/dashboard";
import { ChatPanel } from "src/components/chat/conv";


export function MessagingAndClientRelationshipView() {
    return (
        <DashboardContent>
            {/* <TabWithTableView /> */}
            <ChatPanel />
        </DashboardContent>
    )
}