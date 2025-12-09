import { LoadingButton } from '@mui/lab';
import {
  Button, SelectChangeEvent, Typography, Paper, TextField, FormControlLabel, FormControl,
  InputLabel, Select, MenuItem, Box, Grid, Radio, RadioGroup
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';

import { promotionCreate, promotionEvents } from 'src/redux/actions/promotionAndOffer';
import { AppDispatch, RootState } from 'src/redux/store';

interface ApiResult {
  status: number;
  type: string;
  message: any;
  // Add other properties if needed
}

export function PromotionsAndOffers({ selEvent }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { eventsWithOrdersAndParticiapnt } = useSelector((state: RootState) => state?.promotionList);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [selectedDiscounts, setSelectedDiscounts] = useState('');
  const [earlyBuyerDiscountType, setEarlyBuyerDiscountType] = useState('');
  const [earlyBuyerDiscountValue, setEarlyBuyerDiscountValue] = useState('');

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDiscounts(event.target.value);
    // Reset early buyer specific fields when changing discount type
    if (event.target.value !== 'earlyBuyerDiscount') {
      setEarlyBuyerDiscountType('');
      setEarlyBuyerDiscountValue('');
    }
  };

  const handleEarlyBuyerDiscountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEarlyBuyerDiscountType(event.target.value);
    setEarlyBuyerDiscountValue(''); // Reset value when type changes
  };

  useEffect(() => {
    if (selEvent?._id) {
      setSelectedEvent(selEvent);
      setShowCreateForm(false);
    }
  }, [selEvent]);

  const [promotionFormData, setPromotionFormData] = useState({
    discountValue: '',
    ticketSelection: '',
    validityPeriodStart: '',
    validityPeriodEnd: '',
  });

  const [promoCode, setPromoCode] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handlePromotionChange = (event: any) => {
    event.preventDefault(); // Prevent default form submission behavior
    const { name, value } = event.target;
    setPromotionFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePromoCodeChange = (e: any) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    setPromoCode(value); // Store in state
  };

  const handlePomotionsCreate = useCallback(
    async (event: any) => {
      event.preventDefault();

      if (!selectedEvent?._id) {
        toast.error('Please select an event.');
        return;
      }

      // Validate early buyer discount
      if (selectedDiscounts === 'earlyBuyerDiscount') {
        if (!earlyBuyerDiscountType) {
          toast.error('Please select early buyer discount type.');
          return;
        }
        if (!earlyBuyerDiscountValue) {
          toast.error('Please enter early buyer discount value.');
          return;
        }
        if (earlyBuyerDiscountType === 'percentage' && Number(earlyBuyerDiscountValue) > 100) {
          toast.error('Percentage cannot exceed 100%');
          return;
        }
      }

      const validityStart = new Date(promotionFormData.validityPeriodStart);
      const validityEnd = new Date(promotionFormData.validityPeriodEnd);
      const eventCreatedAt = new Date(selectedEvent.createdAt);
      const eventEndDate = new Date(selectedEvent.date);

      if (validityStart < eventCreatedAt || validityEnd > eventEndDate) {
        toast.error(
          `Validity period must be between event creation date (${eventCreatedAt.toISOString().split('T')[0]}) and event end date (${eventEndDate.toISOString().split('T')[0]}).`
        );
        return;
      }

      const formEventData = new FormData();
      formEventData.append('eventId', selectedEvent._id);
      
      // Handle different discount types
      if (selectedDiscounts === 'earlyBuyerDiscount') {
        formEventData.append('discountValue', earlyBuyerDiscountValue);
        formEventData.append('earlyBuyerDiscountType', earlyBuyerDiscountType);
        formEventData.append('daysBeforeEvent', promotionFormData.discountValue); // This is the days before event
      } else {
        formEventData.append('discountValue', promotionFormData.discountValue);
      }
      
      formEventData.append('ticketSelection', promotionFormData.ticketSelection);
      formEventData.append('validityPeriodEnd', promotionFormData.validityPeriodEnd);
      formEventData.append('validityPeriodStart', promotionFormData.validityPeriodStart);
      formEventData.append('promoCode', promoCode);
      formEventData.append('promotionType', selectedDiscounts);

      try {
        const result = await dispatch(promotionCreate(formEventData));
        if ((result as ApiResult)?.status === 201) {
          toast.success(result?.message);
          setPromotionFormData({
            discountValue: '',
            ticketSelection: '',
            validityPeriodStart: '',
            validityPeriodEnd: '',
          });
          setPromoCode('');
          setSelectedDiscounts('');
          setEarlyBuyerDiscountType('');
          setEarlyBuyerDiscountValue('');
          setShowCreateForm(false);
        } else {
          toast.error(result?.message);
        }
      } catch (error) {
        toast.error('Promotion creation failed');
      }
    },
    [promotionFormData, selectedDiscounts, earlyBuyerDiscountType, earlyBuyerDiscountValue, promoCode, selectedEvent, dispatch]
  );

  const handleEventChange = (event: SelectChangeEvent<string>) => {
    const eventId = event.target.value;
    const foundEvent = eventsWithOrdersAndParticiapnt.find((e: any) => e._id === eventId);
    setSelectedEvent(foundEvent || null);
  };

  const today = new Date().toISOString().split('T')[0];
  let purchaseDeadline = today; // safe default fallback

  if (selectedEvent) {
    // Try to get deadline date string in ISO format
    const rawDeadline = selectedEvent.ticketConfiguration?.purchaseDeadlineDate || selectedEvent.date;
    if (rawDeadline) {
      // Parse and format as yyyy-mm-dd
      purchaseDeadline = new Date(rawDeadline).toISOString().split('T')[0];
    }
  }

  const isFormValid = Boolean(
    selectedDiscounts &&
    promotionFormData.ticketSelection &&
    promotionFormData.validityPeriodStart &&
    promotionFormData.validityPeriodEnd &&
    promoCode
  ) && (
    selectedDiscounts === 'earlyBuyerDiscount' 
      ? Boolean(earlyBuyerDiscountType && earlyBuyerDiscountValue && promotionFormData.discountValue)
      : Boolean(promotionFormData.discountValue)
  );

  return (
    <Box p={3} boxShadow={3} mt={3} borderRadius={3} sx={{ border: '1px solid black' }}>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <HeadingCommon title=" Marketing & Engagement" variant="h6"/>
      
      </Box>
      <Button
        fullWidth
        disabled={!selectedEvent}
        sx={{
          bgcolor: selectedEvent ? '#0B2E4C' : 'gray',
          color: 'white',
          py: 1.5,
          borderRadius: '10px',
          '&:hover': {
            bgcolor: selectedEvent ? '#083048' : 'gray',
          },
        }}
        onClick={() => {
          if (selectedEvent) setShowCreateForm(true);
        }}
      >
        Create a new Promotion
      </Button>

      {showCreateForm && (
        <Paper sx={{ p: 3, borderRadius: '10px', background: '#f5f5f5', mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Create a Promotion
          </Typography>
          <form onSubmit={handlePomotionsCreate}>
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Select Discount Type
            </Typography>
            <RadioGroup
              name="promotionType"
              value={selectedDiscounts}
              onChange={handleDiscountChange}
              row
            >
              {[
                { label: 'Percentage Discount', value: 'percentageDiscount' },
                { label: 'Fixed Amount Discount', value: 'fixedValueDiscount' },
                { label: 'Early Buyer Discount', value: 'earlyBuyerDiscount' },
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio required />}
                  label={option.label}
                />
              ))}
            </RadioGroup>

            {/* Days Before Event Field (Only for Early Buyer Discount) */}
            {selectedDiscounts === 'earlyBuyerDiscount' && (
              <>
                <Typography variant="body2" fontWeight="bold" mb={1}>
                  Days Before Event for Discount
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="discountValue"
                  type="number"
                  placeholder="Enter days before event (e.g., 7)"
                  value={promotionFormData.discountValue}
                  onChange={handlePromotionChange}
                  sx={{ mb: 2 }}
                />
                
                {/* Early Buyer Discount Type Selection */}
                <Typography variant="body2" fontWeight="bold" mb={1}>
                  Early Buyer Discount Type
                </Typography>
                <RadioGroup
                  name="earlyBuyerDiscountType"
                  value={earlyBuyerDiscountType}
                  onChange={handleEarlyBuyerDiscountTypeChange}
                  row
                >
                  <FormControlLabel
                    value="percentage"
                    control={<Radio required />}
                    label="Percentage Discount"
                  />
                  <FormControlLabel
                    value="fixed"
                    control={<Radio required />}
                    label="Fixed Amount Discount"
                  />
                </RadioGroup>

                {/* Early Buyer Discount Value */}
                {earlyBuyerDiscountType && (
                  <>
                    <Typography variant="body2" fontWeight="bold" mb={1}>
                      {earlyBuyerDiscountType === 'percentage' 
                        ? 'Discount Percentage (%)' 
                        : 'Discount Amount (XAF)'}
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      placeholder={
                        earlyBuyerDiscountType === 'percentage'
                          ? 'Enter % (e.g., 10)'
                          : 'Enter amount (e.g., 2000)'
                      }
                      InputProps={{
                        endAdornment:
                          earlyBuyerDiscountType === 'percentage'
                            ? <span style={{ marginLeft: 8 }}>%</span>
                            : <span style={{ marginLeft: 8 }}>XAF</span>,
                      }}
                      value={earlyBuyerDiscountValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (earlyBuyerDiscountType === 'percentage' && Number(val) > 100) {
                          toast.error('Percentage cannot exceed 100%');
                          return;
                        }
                        setEarlyBuyerDiscountValue(val);
                      }}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
              </>
            )}

            {/* Regular Discount Value (For Percentage and Fixed Amount) */}
            {selectedDiscounts !== 'earlyBuyerDiscount' && selectedDiscounts && (
              <>
                <Typography variant="body2" fontWeight="bold" mb={1}>
                  {selectedDiscounts === 'percentageDiscount'
                    ? 'Discount Percentage (%)'
                    : 'Discount Amount (XAF)'}
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="discountValue"
                  type="number"
                  placeholder={
                    selectedDiscounts === 'percentageDiscount'
                      ? 'Enter % (e.g., 10)'
                      : 'Enter amount (e.g., 2000)'
                  }
                  InputProps={{
                    endAdornment:
                      selectedDiscounts === 'percentageDiscount'
                        ? <span style={{ marginLeft: 8 }}>%</span>
                        : <span style={{ marginLeft: 8 }}>XAF</span>,
                  }}
                  value={promotionFormData.discountValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (selectedDiscounts === 'percentageDiscount' && Number(val) > 100) {
                      toast.error('Percentage cannot exceed 100%');
                      return;
                    }
                    setPromotionFormData((prevData) => ({ ...prevData, discountValue: val }));
                  }}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {/* Ticket Selection */}
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Ticket Selection
            </Typography>
            <Select
              fullWidth
              name="ticketSelection"
              value={promotionFormData.ticketSelection}
              onChange={handlePromotionChange}
              required
              displayEmpty
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>
                Select Ticket Type
              </MenuItem>

              {selectedEvent?.ticketConfiguration?.tickets?.map((ticket: any) => (
                <MenuItem key={ticket.id} value={ticket.id}>
                  {ticket.ticketType}
                </MenuItem>
              ))}
            </Select>

            {/* Validity Period */}
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Validity Period
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Start Date"
                  required
                  name="validityPeriodStart"
                  type="date"
                  value={promotionFormData.validityPeriodStart}
                  onChange={handlePromotionChange}
                  // inputProps={{
                  //   min: today,
                  //   max: purchaseDeadline,
                  // }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="End Date"
                  required
                  name="validityPeriodEnd"
                  type="date"
                  value={promotionFormData.validityPeriodEnd}
                  onChange={handlePromotionChange}
                  // inputProps={{
                  //   min: promotionFormData.validityPeriodStart || today,
                  //   max: purchaseDeadline,
                  // }}
                />
              </Grid>
            </Grid>

            {/* Promo Code */}
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Promo Code
            </Typography>
            <TextField
              fullWidth
              placeholder="Promo Code"
              name="promoCode"
              type="text"
              inputProps={{
                style: { textTransform: 'uppercase' },
              }}
              sx={{
                '& input': {
                  textTransform: 'uppercase',
                },
              }}
              value={promoCode}
              onChange={handlePromoCodeChange}
              required
            />

            {/* Submit Button */}
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="contained"
              disabled={!isFormValid}
              sx={{
                mt: 2,
                backgroundColor: isFormValid ? '#0B2E4C' : 'gray',
                '&:hover': {
                  backgroundColor: isFormValid ? '#083048' : 'gray',
                },
              }}
            >
              Save Promotion
            </LoadingButton>

          </form>
        </Paper>
      )}
    </Box>
  );
}