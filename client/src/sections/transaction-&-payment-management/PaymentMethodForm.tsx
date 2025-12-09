import { Box, Button, Paper, Typography, TextField, MenuItem, Select,Dialog,DialogActions,DialogContent,DialogTitle} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { AppDispatch, RootState } from 'src/redux/store';
import { TransactionAndPaymentManagementTable } from "src/components/tables/transaction-&-payment-management-table";
import { transactionsPaymentHistoryTableData, bankingHeaders, mobileMoneyHeaders, cardHeaders } from "./utills";
import { savePaymentSettings, getPaymentSettings, getPaymentSettingById, updatePaymentSetting,deletePaymentSetting} from "../../redux/actions/paymentSettingActions";

interface FormValues {
    currency: string;
    paymentMethod: string;
    fields: {
        [key: string]: string;
    };
}

interface PaymentDetails {
    accountHolder?: string;
    momoNumber?: string;
    iban?: string;
    swift?: string;
    cardDetails?: string;
    [key: string]: any;
}

interface PaymentSetting {
    _id?: string;
    paymentMethod: string;
    method: string;
    details: PaymentDetails;
}

const methodFields: Record<string, string[]> = {
    "Mobile Money (MTN MoMo, Orange Money)": ["Phone Number", "Provider"],
    "Bank Transfer": ["Account Holder Name", "Account Number", "Bank Name", "CIF Number"],
    "Credit/Debit Card (Visa/MasterCard)": ["Cardholder Name", "Card Number", "Expiry Date", "CVV"]
};
const methodValueToLabelMap: { [key: string]: string } = {
    mobile_money: "Mobile Money (MTN MoMo, Orange Money)",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit/Debit Card (Visa/MasterCard)",
};

export function PaymentMethodForm() {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const isEditMode = Boolean(editingId);
    const dispatch = useDispatch<AppDispatch>();
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const { loading, error, success, withDrawalGateway } = useSelector((state: RootState) => state.paymentSettings);
    const { paymentSettingDetail } = useSelector((s: RootState) => s.paymentSettings);
   
    useEffect(() => {
        if (success) {
            dispatch(getPaymentSettings()); // <-- Fetch updated list
            setFormValues({
                currency: "XAF",
                paymentMethod: "",
                fields: {}
            });
        }
        // if (error) {
        //      toast.error(error);
        // }
    }, [success, error, dispatch]);

    useEffect(() => {
        dispatch(getPaymentSettings());
    }, [dispatch]);

    useEffect(() => {
        if (paymentSettingDetail && editingId) {
            const methodKey = methodValueToLabelMap[paymentSettingDetail.paymentMethod] || "";

            setFormValues({
                currency: "XAF",
                paymentMethod: methodKey,
                fields: paymentSettingDetail.details,
            });
        }
    }, [paymentSettingDetail, editingId]);

    const [formValues, setFormValues] = useState<FormValues>({
        currency: "XAF",
        paymentMethod: "",
        fields: {}
    });
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");

    // Get unique services for filter
    const uniqueServices = [...new Set(transactionsPaymentHistoryTableData.map(item => item.requestedService))];

    // Filter logic
    const filteredData = transactionsPaymentHistoryTableData.filter((item) => {
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        const matchService = serviceFilter === "All" || item.requestedService === serviceFilter;
        return matchStatus && matchService;
    });
    const handleFieldChange = (field: string, value: string) => {
        let formattedValue = value;

        // Format Expiry Date with auto-slash
        if (field === "Expiry Date") {
            // Remove non-digits and existing slashes
            const digits = value.replace(/\D/g, "");

            if (digits.length <= 2) {
                formattedValue = digits;
            } else if (digits.length <= 4) {
                formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            } else {
                formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
            }
        }

        // Allow only up to 3 digits for CVV
        if (field === "CVV") {
            formattedValue = value.replace(/\D/g, "").slice(0, 3);
        }

        setFormValues((prev) => ({
            ...prev,
            fields: {
                ...prev.fields,
                [field]: formattedValue,
            },
        }));
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formValues.paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        const requiredFields = methodFields[formValues.paymentMethod];

        const missingField = requiredFields.find(
            (field) => !formValues.fields[field] || formValues.fields[field].trim() === ""
        );

        if (missingField) {
            toast.error(`Please enter ${missingField}.`);
            return;
        }


        const methodKeyMap: { [key: string]: string } = {
            "Mobile Money (MTN MoMo, Orange Money)": "mobile_money",
            "Bank Transfer": "bank_transfer",
            "Credit/Debit Card (Visa/MasterCard)": "credit_card",
        };

        const methodValueMap: { [key: string]: string } = {
            "Mobile Money (MTN MoMo, Orange Money)": formValues.fields.Provider || "",
            "Bank Transfer": "bank_transfer",
            "Credit/Debit Card (Visa/MasterCard)": "visa_mastercard",
        };

        const methodKey = methodKeyMap[formValues.paymentMethod];
        const methodValue = methodValueMap[formValues.paymentMethod];

        const paymentData: PaymentSetting = {
            paymentMethod: methodKey,
            method: methodValue,
            details: formValues.fields,
        };

        if (isEditMode) {
            dispatch(updatePaymentSetting(editingId!, paymentData));
        } else {
            dispatch(savePaymentSettings(paymentData));
        }
    };


    const bankingData = withDrawalGateway
        ?.filter((item: PaymentSetting) => item.paymentMethod === "bank_transfer")
        .map((item: PaymentSetting) => ({
            id: item._id,
            accountHolder: item.details["Account Holder Name"] || "",
            accountNumber: item.details["Account Number"] || "",
            bankName: item.details["Bank Name"] || "",
            cifNumber: item.details["CIF Number"] || "",
            actions: ["Update", "Remove"],
        }));


    const mobileMoneyData = withDrawalGateway
        .filter((item: PaymentSetting) => item.paymentMethod === "mobile_money")
        .map((item: PaymentSetting) => ({
            id: item._id,
            momoNumber: item.details["Phone Number"],
            provider: item.details.Provider,
            actions: ["Update", "Remove"]
        }));


    const cardData = withDrawalGateway
        .filter((item: PaymentSetting) => item.paymentMethod === "credit_card")
        .map((item: PaymentSetting) => ({
            id: item._id,
            details: item.details,
            actions: ["Update", "Remove"],
        }));

    return (
        <>
            {[
                "Mobile Money (MTN MoMo, Orange Money)",
                "Bank Transfer",
                "Visa or Master Card"
            ].map((method) => (
                <Typography key={method} variant="body2" sx={{ ml: 2 }}>
                    • {method}
                </Typography>
            ))}



            {bankingData.length > 0 && (
                <Box mb={3}>
                    <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
                        Banking Information
                    </Typography>
                    <TransactionAndPaymentManagementTable
                        headers={bankingHeaders}
                        data={bankingData}
                        type="banking"
                        onEdit={(id) => {
                            console.log("Editing ID:", id);
                            setEditingId(id);
                            setShowForm(true);
                            setTabValue(1);
                            dispatch(getPaymentSettingById(id));
                            setTimeout(() => {
                                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 300);
                        }}
                    />
                </Box>
            )}
            {mobileMoneyData.length > 0 && (
                <>
                    <Box mb={3}>
                        <TransactionAndPaymentManagementTable
                            headers={mobileMoneyHeaders}
                            data={mobileMoneyData}
                            type="mobileMoney"
                            onEdit={(id) => {
                                console.log("Editing ID:", id);
                                setEditingId(id);
                                setShowForm(true);
                                setTabValue(1);
                                dispatch(getPaymentSettingById(id));
                                setTimeout(() => {
                                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }, 300);
                            }}
                            onDelete={(id) => {
                                setDeleteId(id);
                                setOpenDeleteDialog(true);
                            }}
                        />
                    </Box>
                </>
            )}

            {cardData.length > 0 && (
                <Box mb={3}>
                    <TransactionAndPaymentManagementTable
                        headers={cardHeaders}
                        data={cardData}
                        type="card"
                        onEdit={(id) => {
                            console.log("Editing ID:", id);
                            setEditingId(id);
                            setShowForm(true);
                            setTabValue(1);
                            dispatch(getPaymentSettingById(id));
                            setTimeout(() => {
                                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 300);
                        }}
                    />
                </Box>
            )}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Remove Payment Setting</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to remove this payment setting?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            if (deleteId) {
                                dispatch(deletePaymentSetting(deleteId));
                                toast.success("Payment setting removed successfully!");
                            }
                            setOpenDeleteDialog(false);
                        }}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>


            <Typography variant="h6" fontWeight="bold" mt={1}>
                Banking Information Update
            </Typography>

            <Box sx={{ backgroundColor: "#F2F2F2", borderRadius: "12px", p: 3 }}>
                <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    {/* Select Payment Method */}
                    <Select
                        value={formValues.paymentMethod}
                        onChange={(e) => setFormValues({ ...formValues, paymentMethod: e.target.value, fields: {} })}
                        displayEmpty
                        IconComponent={ExpandMoreRoundedIcon}
                        sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            height: "48px",
                            fontWeight: 500,
                            fontSize: "15px",
                            color: "#000",
                            ".MuiOutlinedInput-notchedOutline": { border: "1px solid #C0C0C0" },
                            mb: 2,
                        }}
                    >
                        <MenuItem value="">Select Payment Method</MenuItem>
                        {Object.keys(methodFields).map((method) => (
                            <MenuItem key={method} value={method}>{method}</MenuItem>
                        ))}
                    </Select>

                    {/* Render Fields Based on Method */}
                    {formValues.paymentMethod &&
                        methodFields[formValues.paymentMethod]?.map((field) => {
                            if (field === "Provider" && formValues.paymentMethod === "Mobile Money (MTN MoMo, Orange Money)") {
                                return (
                                    <Select
                                        key={field}
                                        value={formValues.fields.Provider || ""}
                                        onChange={(e) => handleFieldChange("Provider", e.target.value)}
                                        displayEmpty
                                        IconComponent={ExpandMoreRoundedIcon}
                                        sx={{
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "12px",
                                            height: "48px",
                                            fontWeight: 500,
                                            fontSize: "15px",
                                            color: "#000",
                                            ".MuiOutlinedInput-notchedOutline": { border: "1px solid #C0C0C0" },
                                        }}
                                    >
                                        <MenuItem value="">Select Provider</MenuItem>
                                        <MenuItem value="MTN MoMo">MTN MoMo</MenuItem>
                                        <MenuItem value="Orange Money">Orange Money</MenuItem>
                                    </Select>
                                );
                            }

                            return (
                                <TextField
                                    key={field}
                                    fullWidth
                                    label={field}
                                    placeholder={focusedField === field ? "" : field}
                                    value={formValues.fields[field] || ""}
                                    onFocus={() => setFocusedField(field)}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => handleFieldChange(field, e.target.value)}
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        sx: {
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "12px",
                                            height: "48px",
                                        },
                                    }}
                                />
                            );
                        })}

                    {/* Save Button */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#0B2E4C",
                                color: "white",
                                borderRadius: "6px",
                                textTransform: "none",
                                px: 3,
                                "&:hover": { backgroundColor: "#002244" },
                            }}
                        >
                            {showForm && (
                                <div ref={formRef}>
                                    <Typography>
                                        {isEditMode ? "Update Payment Details" : "Add Payment Details"}
                                    </Typography>
                                </div>
                            )}
                            {!showForm && (
                                <div ref={formRef}>
                                    <Typography>
                                        Add Payment Details
                                    </Typography>
                                </div>
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
