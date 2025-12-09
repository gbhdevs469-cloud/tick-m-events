import { Box, Paper } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppDispatch, RootState } from "src/redux/store";
import { TabButton } from "src/components/button/multiple-button";

import { RequestTabSection } from "./request-tab-section";
import { CalenderView } from "./calender-view";
import { ReminderSelector } from "./ReminderSelector";
import { saveNotiicationReminderSettings } from "../../redux/actions/reminderActions";

export function TabWithTableView() {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [reminderState, setReminderState] = useState<{ [key: string]: Record<string, boolean> }>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { completedRequests, signedReqests } = useSelector(
    (state: RootState) => state?.serviceRequest
  );

  const confirmedServiceListTableHeader = [
    "Service",
    "Location",
    "Date & Time",
    "Expected Payment",
    "Reminders",
  ];

  // ✅ Merge completed + signed (only where isSigned is true)
  const confirmedServiceList = [
    ...(completedRequests || []),
    ...(signedReqests?.filter((r: any) => r?.isSigned) || []),
  ];

  const confirmedServiceListTableData =
    confirmedServiceList.map((r: any) => {
      const id = r._id;
      const eventId = r.eventId?._id;

      let reminders = reminderState[id];

      // If not present in local state, set and sync default reminders
      if (!reminders && eventId) {
        reminders = {
          "1 Week": true,
          "3 Days": true,
          "3 Hours": true,
        };

        // Async call (non-blocking fire & forget)
        setTimeout(() => {
          dispatch(saveNotiicationReminderSettings(eventId, reminders));
          setReminderState((prev) => ({
            ...prev,
            [id]: reminders,
          }));
        }, 0);
      }

      return {
        id,
        service: r?.serviceRequestId?.serviceType || "N/A",
        location: r?.eventId?.location || "N/A",
        date: `${new Date(r?.eventId?.date).toLocaleDateString()} - ${
          r?.eventId?.time || "N/A"
        }`,
        payment: r?.orgBudget ? `${r.orgBudget} XAF` : "N/A",
        reminders: (
          <ReminderSelector
            reminders={reminders}
            onChange={async (updated) => {
              setReminderState((prev) => ({
                ...prev,
                [id]: updated,
              }));
              if (eventId) {
                const res = await dispatch(saveNotiicationReminderSettings(eventId, updated));
                if (res?.status === 200) {
                  toast.success(res?.message || "Reminder updated successfully ✅");
                } else {
                  toast.error(res?.message || "Failed to update reminder ❌");
                }
              }
            }}
          />
        ),
      };
    }) || [];

    const reminderCount = confirmedServiceListTableData.filter((r: any) =>
    r.reminders && Object.values(reminderState[r.id] || {}).some((val) => val)
  ).length;
 
  const tabLabels = [
    "Calendar View",
    `Reminders & Notifications(${reminderCount})`,
  ];

  return (
    <>
      <Box
        sx={{
          overflow: "hidden",
          marginTop: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TabButton tabValue={tabValue} tabLabels={tabLabels} onChange={handleTabChange} />
      </Box>

      {tabValue === 0 && (
        <Paper
          elevation={6}
          sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden", mt: 2 }}
        >
          <CalenderView />
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper
          elevation={6}
          sx={{ mt: 2, p: 3, borderRadius: 2, boxShadow: 3, overflow: "hidden" }}
        >
          {confirmedServiceListTableData.length > 0 ? (
            <RequestTabSection
              title="Confirmed Service List"
              headers={confirmedServiceListTableHeader}
              data={confirmedServiceListTableData}
              type="2"
            />
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 5,
                color: "#2395d4",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              No confirmed services available.
            </Box>
          )}
        </Paper>
      )}
    </>
  );
}
