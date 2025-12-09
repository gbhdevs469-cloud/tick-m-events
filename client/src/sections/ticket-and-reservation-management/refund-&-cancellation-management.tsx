import {
  Box,
  Button,
  Radio,
  RadioGroup,
  TextField,
  FormControlLabel,
  Typography
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'src/redux/store';
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { TicketReservationManagementTable } from "src/components/tables/ticket-reservation-management-table";
import { toast } from 'react-toastify';
import { updateRefundPolicy } from "../../redux/actions/ticket-&-reservation-management.action";

export function RefundAndCancellationManangement({ orderList }: any) {
  const {  tickets, refundRequests } = orderList

  const dispatch = useDispatch<AppDispatch>();
  const refundCancelationTableHeaders = ["Transaction", "Participant", "Ticket Type", "Purchase Date", "Amount", "Status", "Actions"];

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [daysBeforeEvent, setDaysBeforeEvent] = useState("");
  const [partialRefundPercent, setPartialRefundPercent] = useState("");
  const [cutoffDate, setCutoffDate] = useState("");
  const [isModified, setIsModified] = useState(false);
  const initialPolicyRef = useRef<any>(null);

  useEffect(() => {
    if (!tickets || tickets.length === 0) return;

    const ticketConfig = tickets[0];
    const refundPolicy = ticketConfig?.refundPolicy;
    const isEnabled = ticketConfig?.isRefundPolicyEnabled;

    let initialPolicy = {
      selectedPolicy: "",
      daysBeforeEvent: "",
      partialRefundPercent: "",
      cutoffDate: ""
    };

    if (!refundPolicy || !isEnabled) {
      setSelectedPolicy("");
    } else if (refundPolicy.fullRefund) {
      setSelectedPolicy("fullRefund");
      setDaysBeforeEvent(refundPolicy.fullRefundDaysBefore || "");
      initialPolicy = {
        selectedPolicy: "fullRefund",
        daysBeforeEvent: refundPolicy.fullRefundDaysBefore || "",
        partialRefundPercent: "",
        cutoffDate: ""
      };
    } else if (refundPolicy.partialRefund) {
      setSelectedPolicy("partialRefund");
      setPartialRefundPercent(refundPolicy.partialRefundPercent || "");
      initialPolicy = {
        selectedPolicy: "partialRefund",
        daysBeforeEvent: "",
        partialRefundPercent: refundPolicy.partialRefundPercent || "",
        cutoffDate: ""
      };
    } else if (refundPolicy.noRefundAfterDate) {
      setSelectedPolicy("noRefundAfterDate");
      const date = refundPolicy.noRefundDate?.split("T")[0] || "";
      setCutoffDate(date);
      initialPolicy = {
        selectedPolicy: "noRefundAfterDate",
        daysBeforeEvent: "",
        partialRefundPercent: "",
        cutoffDate: date
      };
    } else if (refundPolicy.noRefund) {
      setSelectedPolicy("noRefund");
      initialPolicy = {
        selectedPolicy: "noRefund",
        daysBeforeEvent: "",
        partialRefundPercent: "",
        cutoffDate: ""
      };
    } else {
      // **Neither policy selected nor explicitly “noRefund”**
      setSelectedPolicy("");
      initialPolicy = {
        selectedPolicy: "",
        daysBeforeEvent: "",
        partialRefundPercent: "",
        cutoffDate: ""
      };
    }

    initialPolicyRef.current = initialPolicy;
    setIsModified(false); // reset on load
  }, [tickets]);

  useEffect(() => {
    const current = {
      selectedPolicy,
      daysBeforeEvent,
      partialRefundPercent,
      cutoffDate
    };

    const initial = initialPolicyRef.current;

    const hasChanges =
      current.selectedPolicy !== initial?.selectedPolicy ||
      current.daysBeforeEvent !== initial?.daysBeforeEvent ||
      current.partialRefundPercent !== initial?.partialRefundPercent ||
      current.cutoffDate !== initial?.cutoffDate;

    setIsModified(hasChanges);
  }, [selectedPolicy, daysBeforeEvent, partialRefundPercent, cutoffDate]);


  const handleSave = async () => {
    const payload = {
      eventId: tickets[0]?.eventId,
      fullRefund: selectedPolicy === "fullRefund",
      fullRefundDaysBefore: selectedPolicy === "fullRefund" ? daysBeforeEvent : "",
      partialRefund: selectedPolicy === "partialRefund",
      partialRefundPercent: selectedPolicy === "partialRefund" ? partialRefundPercent : "",
      noRefundAfterDate: selectedPolicy === "noRefundAfterDate",
      noRefundDate: selectedPolicy === "noRefundAfterDate" ? cutoffDate : null,
      isRefundPolicyEnabled: selectedPolicy !== "",
    };

    if (!payload.eventId) {
      toast.error("Missing event ID.");
      return;
    }

    const result = await dispatch(updateRefundPolicy(payload));

    if (result.status === 200) {
      toast.success(result.message || "Refund policy updated successfully!");
      const newInitialPolicy = {
        selectedPolicy,
        daysBeforeEvent,
        partialRefundPercent,
        cutoffDate,
      };
      initialPolicyRef.current = newInitialPolicy;
      setIsModified(false); // this will disable the button

    } else {
      toast.error(result.message || "Something went wrong.");
    }
  };

  const isFreeTicket = tickets?.every((ticket: any) => ticket?.payStatus?.toLowerCase() === "free");

  return (
    <Box mt={3} mb={5} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
      {/* Title */}
      <HeadingCommon
        baseSize="33px"
        weight={700}
        variant="h5"
        title="Refund & Cancellation Management"
        color="#0B2E4E"
      />
      {isFreeTicket ? (
        <Typography mt={2} fontSize="16px" color="text.secondary">
          This is a free ticket, so refund is not allowed.
        </Typography>
      ) : (
        <>
          {/* Table */}
          <TicketReservationManagementTable headers={refundCancelationTableHeaders} data={refundRequests} type="4" />

          {/* Refund Policy Configuration */}
          <Box mt={4}>
            <HeadingCommon
              baseSize="30px"
              weight={700}
              variant="h5"
              title="Refund Policy Configuration"
              color="#0B2E4E"
            />

            <RadioGroup
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value)}
              sx={{ mt: 2 }}
            >
              <FormControlLabel
                value="fullRefund"
                control={<Radio />}
                label="Full Refund available up to X days before the event"
              />
              {selectedPolicy === "fullRefund" && (
                <TextField
                  size="small"
                  placeholder="Enter number of days"
                  value={daysBeforeEvent}
                  onChange={(e) => setDaysBeforeEvent(e.target.value)}
                  sx={{ ml: 4, mt: 1, width: "200px" }}
                />
              )}

              <FormControlLabel
                value="partialRefund"
                control={<Radio />}
                label="Partial Refund with Fee (% of ticket price retained)"
              />
              {selectedPolicy === "partialRefund" && (
                <TextField
                  size="small"
                  placeholder="Enter percentage"
                  value={partialRefundPercent}
                  onChange={(e) => setPartialRefundPercent(e.target.value)}
                  sx={{ ml: 4, mt: 1, width: "200px" }}
                />
              )}

              <FormControlLabel
                value="noRefund"
                control={<Radio />}
                label="No Refund after purchasing the ticket"
              />

              <FormControlLabel
                value="noRefundAfterDate"
                control={<Radio />}
                label="No Refunds after a set date"
              />
              {selectedPolicy === "noRefundAfterDate" && (
                <TextField
                  type="date"
                  size="small"
                  value={cutoffDate}
                  onChange={(e) => setCutoffDate(e.target.value)}
                  sx={{ ml: 4, mt: 1, width: "200px" }}
                />
              )}
            </RadioGroup>

            <Button
              variant="contained"
              sx={{ bgcolor: "#0B2E4C", color: "white", mt: 3, width: "200px" }}
              disabled={!isModified}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </>
      )

      }

    </Box>
  );
}

