import { useState, useEffect } from "react";
import {
    Box, Button, MenuItem, Paper, Select, TextField, Typography, FormControl, InputLabel,
    Grid
} from "@mui/material";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";

import { createWithdrawal, verifyWithdrawalOTP, sendWithdrawalOTP } from "src/redux/actions/transactionPaymentActions";
import { AppDispatch, RootState } from 'src/redux/store';
import { getPaymentSettings } from "src/redux/actions/paymentSettingActions";

type WithdrawalRequestProps = {
    availableBalance: number;
    eventId?: string;
};

type PaymentMethod = {
    _id: string;
    userId: string;
    paymentMethod: string;
    method: string;
    details: Record<string, string>;
};

export function WithdrawalRequest({ availableBalance, eventId }: WithdrawalRequestProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success, withDrawalGateway } = useSelector((state: RootState) => state.paymentSettings);
    const { user } = useSelector((state: RootState) => state?.auth);

    useEffect(() => {
        dispatch(getPaymentSettings())
    }, [dispatch]);

    // Group payment methods by type
    const groupedPaymentMethods = (withDrawalGateway || []).reduce((acc: Record<string, PaymentMethod[]>, method: PaymentMethod) => {
        if (!acc[method.paymentMethod]) {
            acc[method.paymentMethod] = [];
        }
        acc[method.paymentMethod].push(method);
        return acc;
    }, {});

    // Get available payment method types
    const availablePaymentTypes = Object.keys(groupedPaymentMethods);

    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(availablePaymentTypes[0] || "");
    const [selectedMethodId, setSelectedMethodId] = useState("");
    const [withdrawalCode, setWithdrawalCode] = useState("");

    // Bank Transfer Fields
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [swiftCode, setSwiftCode] = useState("");
    const [country, setCountry] = useState("");

    // Mobile Money Fields
    const [mobileNetwork, setMobileNetwork] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    // Card
    const [cardType, setCardType] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Effect to auto-select the first method when payment method changes

    useEffect(() => {
        if (paymentMethod && groupedPaymentMethods[paymentMethod]?.length > 0) {

            if (!selectedMethodId || !groupedPaymentMethods[paymentMethod].some((m: PaymentMethod) => m._id === selectedMethodId)) {
                const firstMethod = groupedPaymentMethods[paymentMethod][0];
                setSelectedMethodId(firstMethod._id);
                fillFormFields(firstMethod);
            }
        }
    }, [paymentMethod, groupedPaymentMethods, selectedMethodId]);


    // Effect to update form fields when a specific method is selected
    useEffect(() => {
        if (selectedMethodId) {
            const selectedMethod = (withDrawalGateway || []).find((method: PaymentMethod) => method._id === selectedMethodId);
            if (selectedMethod) {
                fillFormFields(selectedMethod);
            }
        }
    }, [selectedMethodId, withDrawalGateway]);

    const fillFormFields = (method: PaymentMethod) => {
        const details = method.details || {};

        if (method.paymentMethod === "bank_transfer") {
            setBankName(details["Bank Name"] || "");
            setAccountNumber(details["Account Number"] || "");
            setBeneficiaryName(details["Account Holder Name"] || details["Beneficiary Name"] || "");
            setSwiftCode(details["SWIFT Code"] || details["CIF Number"] || "");
            setCountry(details.Country || "");
        } else if (method.paymentMethod === "mobile_money") {
            setMobileNetwork(method.method === "mtn" ? "mtn" : "orange");
            setMobileNumber(details["Phone Number"] || "");
        } else if (method.paymentMethod === "credit_card") {
            setCardType(method.method.includes("visa") ? "visa" : "mastercard");
            setCardHolderName(details["Cardholder Name"] || "");
            setCardNumber(details["Card Number"] || "");
            setCardExpiry(details["Expiry Date"] || "");
            setCardCvv(details.CVV || "");
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // remove non-digit characters

        if (value.length > 4) value = value.slice(0, 4); // limit to MMYY

        if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }

        setCardExpiry(value);
    };

    const handleSendOTP = async () => {
        try {
            const res = await sendWithdrawalOTP(user._id);
            if (res?.success) {
                toast.success("OTP sent to your email.", { toastId: "otp-toast" });
            } else {
                toast.error(res?.message || "Failed to send OTP");
            }
        } catch (errorss) {
            toast.error("An error occurred while sending OTP.");
        }
    };

    const handleWithdrawalSubmit = async () => {
        const newErrors: { [key: string]: string } = {};

        if (!amount) newErrors.amount = "Amount is required";
        if (!withdrawalCode) newErrors.withdrawalCode = "Withdrawal code is required";

        if (paymentMethod === "bank_transfer") {
            if (!bankName) newErrors.bankName = "Bank name is required";
            if (!accountNumber) newErrors.accountNumber = "Account number is required";
            if (!beneficiaryName) newErrors.beneficiaryName = "Beneficiary name is required";
            if (!country) newErrors.country = "Country is required";
        }
        if (paymentMethod === "mobile_money") {
            if (!mobileNetwork) newErrors.mobileNetwork = "Mobile network is required";
            if (!mobileNumber) newErrors.mobileNumber = "Mobile number is required";
        }

        if (paymentMethod === "credit_card") {
            if (!cardType) newErrors.cardType = "Card type is required";
            if (!cardHolderName) newErrors.cardHolderName = "Card holder name is required";
            if (!cardNumber) {
                newErrors.cardNumber = "Card number is required";
            } else {
                const cleaned = cardNumber.replace(/\s/g, "");
                const isVisa = cardType === "visa" && /^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned);
                const isMaster = cardType === "mastercard" && /^5[1-5][0-9]{14}$/.test(cleaned);

                if (!isVisa && !isMaster) {
                    newErrors.cardNumber = "Invalid card number for selected card type.";
                }
            }

            if (!cardCvv) {
                newErrors.cardCvv = "Card CVV is required";
            } else if (!/^\d{3}$/.test(cardCvv)) {
                newErrors.cardCvv = "CVV must be exactly 3 digits";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (!user || !user._id) {
            toast.error("User is not logged in or not properly defined.");
            return;
        }
        setErrors({});

        // ✅ Step 1: Verify OTP
        const otpResult = await dispatch(verifyWithdrawalOTP(user._id, withdrawalCode));

        if (!otpResult?.success) {
            setErrors((prev) => ({
                ...prev,
                withdrawalCode: otpResult.message || "OTP verification failed."
            }));

            return;
        }

        // ✅ Step 2: Build payment object
        let payment = {
            paymentMethod,
            method: "",
            details: {}
        };

        if (paymentMethod === "bank_transfer") {
            payment = {
                paymentMethod: "bank_transfer",
                method: bankName.toLowerCase().replace(/\s/g, "_"),
                details: { bankName, accountNumber, beneficiaryName, swiftCode, country }
            };
        }

        if (paymentMethod === "mobile_money") {
            payment = {
                paymentMethod: "mobile_money",
                method: mobileNetwork.toLowerCase().replace(/\s/g, "_"),
                details: { mobileNetwork, mobileNumber }
            };
        }

        if (paymentMethod === "credit_card") {
            payment = {
                paymentMethod: "credit_card",
                method: cardType,
                details: {
                    cardType,
                    cardHolderName,
                    cardNumber,
                    cardExpiry,
                    cardCvv
                }
            };
        }
        const withdrawalData = {
            userId: user?._id,
            amount: parseFloat(amount),
            withdrawalCode,
            payment,
            eventId,
            balance: availableBalance,
        };

        const result = await dispatch(createWithdrawal(withdrawalData));

        if (result?.type === "CREATE_WITHDRAWAL_SUCCESS") {
            toast.success("Withdrawal request submitted successfully!");
            setAmount("");
            setWithdrawalCode("");
        } else {
            toast.error("Something went wrong.");
        }
    };

    return (
        <Box id="t&pay">
            <Typography variant="h5" fontSize={{ xs: 20, sm: 25, md: 33 }} fontWeight={600} sx={{ mt: 3 }}>
                Withdrawal Requests
            </Typography>

            <Box mt={3} boxShadow={3} borderRadius={3}>
                <Paper sx={{ p: 3 }}>
                    {/* Available Amount */}
                    <Typography fontWeight="bold">Available Amount</Typography>
                    <TextField fullWidth variant="outlined" value={`${availableBalance} XAF`} sx={{ mt: 1 }} />
                    <Typography sx={{ fontSize: "0.9rem", mt: 1, color: "gray" }}>
                        Minimum Withdrawal Amount: 50 XAF
                    </Typography>

                    {/* Amount Input */}
                    <Typography fontWeight="bold" sx={{ mt: 3 }}>
                        Amount To Withdraw
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter Amount"
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ mt: 1 }}
                        error={!!errors.amount}
                        helperText={errors.amount}
                    />

                    {/* Select Payment Method */}
                    <Typography fontWeight="bold" sx={{ mt: 3 }}>
                        Select a Payment Method
                    </Typography>
                    <Select
                        fullWidth
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        sx={{ mt: 1 }}
                    >
                        {availablePaymentTypes.map(type => (
                            <MenuItem key={type} value={type}>
                                {type === "credit_card" && "Credit Card (Visa / Mastercard)"}
                                {type === "mobile_money" && "Mobile Money (MTN MoMo / Orange Money)"}
                                {type === "bank_transfer" && "Bank Transfer"}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Credit Card Details */}
                    {paymentMethod === "credit_card" && (
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth error={!!errors.cardType}>
                                    <InputLabel>Select Card Type</InputLabel>
                                    <Select
                                        value={cardType}
                                        onChange={(e) => setCardType(e.target.value)}
                                        label="Select Card Type"
                                    >
                                        <MenuItem value="visa">Visa</MenuItem>
                                        <MenuItem value="mastercard">Mastercard</MenuItem>
                                    </Select>
                                    {errors.cardType && (
                                        <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: 0.5 }}>
                                            {errors.cardType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Card Holder Name"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    error={!!errors.cardHolderName}
                                    helperText={errors.cardHolderName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                                        const formatted = value.replace(/(.{4})/g, "$1 ").trim();
                                        setCardNumber(formatted);
                                    }}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3} md={1.5}>
                                <TextField
                                    fullWidth
                                    label="Expiry (MM/YY)"
                                    value={cardExpiry}
                                    onChange={handleExpiryChange}
                                    error={!!errors.cardExpiry}
                                    helperText={errors.cardExpiry}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3} md={1.5}>
                                <TextField
                                    fullWidth
                                    label="CVV"
                                    value={cardCvv}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,3}$/.test(value)) setCardCvv(value);
                                    }}
                                    error={!!errors.cardCvv}
                                    helperText={errors.cardCvv}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Bank Transfer Fields */}
                    {paymentMethod === "bank_transfer" && (
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    placeholder="Enter Bank Name"
                                    variant="outlined"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    error={!!errors.bankName}
                                    helperText={errors.bankName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    placeholder="Enter Account Number"
                                    variant="outlined"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    error={!!errors.accountNumber}
                                    helperText={errors.accountNumber}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="Beneficiary Name"
                                    placeholder="Full Name of the Account Holder"
                                    variant="outlined"
                                    value={beneficiaryName}
                                    onChange={(e) => setBeneficiaryName(e.target.value)}
                                    error={!!errors.beneficiaryName}
                                    helperText={errors.beneficiaryName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="SWIFT/BIC Code (Optional)"
                                    placeholder="Enter SWIFT or BIC Code"
                                    variant="outlined"
                                    value={swiftCode}
                                    onChange={(e) => setSwiftCode(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    placeholder="Enter Country"
                                    variant="outlined"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    error={!!errors.country}
                                    helperText={errors.country}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {paymentMethod === "mobile_money" && (
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid item xs={12} sm={6} md={6}>
                                <FormControl fullWidth error={!!errors.mobileNetwork}>
                                    <InputLabel>Mobile Network</InputLabel>
                                    <Select
                                        fullWidth
                                        value={selectedMethodId}
                                        onChange={(e) => setSelectedMethodId(e.target.value)}
                                    >
                                        {groupedPaymentMethods[paymentMethod].map((method: PaymentMethod) => (
                                            <MenuItem key={method._id} value={method._id}>
                                                {method.paymentMethod === "bank_transfer" &&
                                                    `${method.details["Bank Name"]} - ${method.details["Account Number"]}`
                                                }
                                                {method.paymentMethod === "mobile_money" &&
                                                    `${method.method === "MTN MoMo" ? "MTN MoMo" : "Orange Money"} - ${method.details["Phone Number"]}`
                                                }
                                                {method.paymentMethod === "credit_card" &&
                                                    `${method.method.includes("visa") ? "Visa" : "Mastercard"} - ${method.details["Card Number"]?.slice(-4)}`
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile Number"
                                    placeholder="Enter Mobile Money Number"
                                    variant="outlined"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    error={!!errors.mobileNumber}
                                    helperText={errors.mobileNumber}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Withdrawal Code */}
                    <Typography fontWeight="bold" sx={{ mt: 3 }}>
                        Withdrawal Code
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                        <TextField
                            fullWidth
                            placeholder="Enter Withdrawal Code"
                            variant="outlined"
                            value={withdrawalCode}
                            onChange={(e) => setWithdrawalCode(e.target.value)}
                            error={!!errors.withdrawalCode}
                            helperText={errors.withdrawalCode}
                        />

                        <Button
                            variant="outlined"
                            onClick={handleSendOTP}
                        >
                            Send OTP
                        </Button>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, backgroundColor: "#0B2E4C", color: "white", py: 1.5 }}
                        onClick={handleWithdrawalSubmit}
                    >
                        Request Withdrawal
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}