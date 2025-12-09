import { Button, Typography, Paper, TextField, Box, Grid, MenuItem, Select, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import PromotionAndOfferTable from 'src/components/tables/promotin-and-offer-table';
import { AppDispatch, RootState } from 'src/redux/store';
import { promotionUpdate } from 'src/redux/actions';
import { promotionTableHeaders } from './utill';

interface ApiResult {
  status: number;
  type: string;
  message: any;
  // Add other properties if needed
}

export function ActivePromotion({ selEvent }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { promotions } = useSelector((state: RootState) => state?.promotionList);
  const [promotionRowData, setPromotionRowData] = useState({
    _id: '',
    discountValue: '',
    ticketSelection: '',
    validityPeriodStart: '',
    validityPeriodEnd: '',
    promotionType: '',
    status: '',
    earlyBuyerDiscountType: '', // NEW FIELD
    daysBeforeEvent: '', // NEW FIELD
  });

  const [editMode, setEditMode] = useState(false);

  const handleModify = useCallback((rowData: any) => {
    setPromotionRowData((prev) => {
      if (
        prev._id === rowData._id &&
        prev.discountValue === rowData.discountValue &&
        prev.ticketSelection === rowData.ticketSelection &&
        prev.validityPeriodStart === rowData.validityPeriodStart &&
        prev.validityPeriodEnd === rowData.validityPeriodEnd &&
        prev.promotionType === rowData.promotionType &&
        prev.status === rowData.status &&
        prev.earlyBuyerDiscountType === rowData.earlyBuyerDiscountType &&
        prev.daysBeforeEvent === rowData.daysBeforeEvent
      ) {
        return prev;
      }
      return {
        _id: rowData._id,
        discountValue: rowData.discountValue,
        ticketSelection: rowData.ticketSelection,
        validityPeriodStart: rowData.validityPeriodStart,
        validityPeriodEnd: rowData.validityPeriodEnd,
        promotionType: rowData.promotionType,
        status: rowData.status,
        earlyBuyerDiscountType: rowData.earlyBuyerDiscountType || '', // NEW FIELD
        daysBeforeEvent: rowData.daysBeforeEvent || '', // NEW FIELD
      };
    });
    setEditMode(true);
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, newStatus: string) => {
      const formEventData = new FormData();
      formEventData.append('status', newStatus);

      try {
        const result = await dispatch(promotionUpdate({ formEventData, _id: id }));
        if ((result as ApiResult)?.status === 200) {
          toast.success('Status updated successfully');
        } else {
          toast.error(result?.message || 'Failed to update status');
        }
      } catch (error) {
        toast.error('Status update failed');
      }
    },
    [dispatch]
  );

  const handlePromotionUpdateChange = (event: any) => {
    event.preventDefault(); // Prevent default form submission behavior
    const { name, value } = event.target;
    setPromotionRowData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEarlyBuyerDiscountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPromotionRowData((prevData) => ({ 
      ...prevData, 
      earlyBuyerDiscountType: value 
    }));
  };

  const handlePomotionsUpdate = useCallback(
    async (event: any) => {
      event.preventDefault();
      
      // Validate early buyer discount
      if (promotionRowData.promotionType === 'earlyBuyerDiscount') {
        if (!promotionRowData.earlyBuyerDiscountType) {
          toast.error('Please select early buyer discount type.');
          return;
        }
        if (!promotionRowData.daysBeforeEvent) {
          toast.error('Please enter days before event.');
          return;
        }
        if (promotionRowData.earlyBuyerDiscountType === 'percentage' && Number(promotionRowData.discountValue) > 100) {
          toast.error('Percentage cannot exceed 100%');
          return;
        }
      }

      const formEventData = new FormData();
      formEventData.append('promotionType', promotionRowData.promotionType);
      formEventData.append('validityPeriodStart', promotionRowData.validityPeriodStart);
      formEventData.append('validityPeriodEnd', promotionRowData.validityPeriodEnd);
      formEventData.append('discountValue', promotionRowData.discountValue);
      formEventData.append('status', promotionRowData.status);
      
      // Add early buyer specific fields if applicable
      if (promotionRowData.promotionType === 'earlyBuyerDiscount') {
        formEventData.append('earlyBuyerDiscountType', promotionRowData.earlyBuyerDiscountType);
        formEventData.append('daysBeforeEvent', promotionRowData.daysBeforeEvent);
      }

      try {
        const result = await dispatch(
          promotionUpdate({ formEventData, _id: promotionRowData._id })
        );
        if ((result as ApiResult)?.status === 200) {
          toast.success(result?.message);
          setPromotionRowData({
            _id: '',
            discountValue: '',
            ticketSelection: '',
            validityPeriodStart: '',
            validityPeriodEnd: '',
            promotionType: '',
            status: '',
            earlyBuyerDiscountType: '',
            daysBeforeEvent: '',
          });
          setEditMode(false);
        } else {
          toast.error(result?.message);
        }
      } catch (error) {
        toast.error('Promotion update failed');
      }
    },
    [promotionRowData, dispatch]
  );

  const handleCancelModify = useCallback(() => {
    setPromotionRowData({
      _id: '',
      discountValue: '',
      ticketSelection: '',
      validityPeriodStart: '',
      validityPeriodEnd: '',
      promotionType: '',
      status: '',
      earlyBuyerDiscountType: '',
      daysBeforeEvent: '',
    });
    setEditMode(false);
  }, []);

  const eventPromotions = promotions?.filter((promo: any) => promo.eventId === selEvent?._id);

  return (
    <Box p={3} boxShadow={3} mt={3} borderRadius={3} sx={{ border: '1px solid black' }}>
      <Typography variant="h6" fontWeight="bold">
        Active Promotions
      </Typography>

      {/* Filter Header Section */}
      <Box
        mt={3}
        display="flex"
        justifyContent="start"
        sx={{
          gap: 3, // spacing between labels
          pb: 1,
          overflowX: 'auto',
          borderBottom: '4px solid #ccc',
          width: 'fit-content',
        }}
      >
        {['Type', 'Discount', 'Ticket Type', 'Validity', 'Status'].map((label, index) => (
          <Typography
            key={index}
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              color: '#000',
              textAlign: 'left',
              paddingBottom: '4px',
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Responsive Table */}
      <PromotionAndOfferTable
        headers={promotionTableHeaders}
        data={eventPromotions}
        onModify={handleModify}
        onStatusChange={handleStatusChange}
        onCancelEdit={handleCancelModify}
      />

      {/* Edit Promotion Section */}
      {editMode && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: '#F2F2F2',
            mt: 3,
            border: '1px solid black',
          }}
        >
          <form onSubmit={handlePomotionsUpdate}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Edit Promotion
            </Typography>

            <Grid container spacing={3}>
              {/* Promotion Type */}
              <Grid item xs={12} sm={6}>
                <Typography fontSize="13px" fontWeight={500} mb={1}>
                  Promotion Type
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  name="promotionType"
                  value={promotionRowData.promotionType}
                  onChange={handlePromotionUpdateChange}
                >
                  <MenuItem value="percentageDiscount">Percentage Discount</MenuItem>
                  <MenuItem value="fixedValueDiscount">Fixed Amount Discount</MenuItem>
                  <MenuItem value="earlyBuyerDiscount">Early Buyer Discount</MenuItem>
                </Select>
              </Grid>

              {/* Days Before Event (Only for Early Buyer Discount) */}
              {promotionRowData.promotionType === 'earlyBuyerDiscount' && (
                <Grid item xs={12} sm={6}>
                  <Typography fontSize="13px" fontWeight={500} mb={1}>
                    Days Before Event
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="daysBeforeEvent"
                    placeholder="Enter days before event (e.g., 7)"
                    value={promotionRowData.daysBeforeEvent}
                    onChange={handlePromotionUpdateChange}
                  />
                </Grid>
              )}

              {/* Early Buyer Discount Type (Only for Early Buyer Discount) */}
              {promotionRowData.promotionType === 'earlyBuyerDiscount' && (
                <Grid item xs={12}>
                  <Typography fontSize="13px" fontWeight={500} mb={1}>
                    Early Buyer Discount Type
                  </Typography>
                  <RadioGroup
                    name="earlyBuyerDiscountType"
                    value={promotionRowData.earlyBuyerDiscountType}
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
                </Grid>
              )}

              {/* Discount Value */}
              <Grid item xs={12} sm={6}>
                <Typography fontSize="13px" fontWeight={500} mb={1}>
                  {promotionRowData.promotionType === 'earlyBuyerDiscount' 
                    ? (promotionRowData.earlyBuyerDiscountType === 'percentage' 
                        ? 'Discount Percentage (%)' 
                        : 'Discount Amount (XAF)')
                    : promotionRowData.promotionType === 'percentageDiscount'
                      ? 'Discount Percentage (%)'
                      : 'Discount Amount (XAF)'}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={
                    promotionRowData.promotionType === 'earlyBuyerDiscount'
                      ? (promotionRowData.earlyBuyerDiscountType === 'percentage' 
                          ? 'Enter % (e.g., 10)' 
                          : 'Enter amount (e.g., 2000)')
                      : promotionRowData.promotionType === 'percentageDiscount'
                        ? 'Enter % (e.g., 10)'
                        : 'Enter amount (e.g., 2000)'
                  }
                  name="discountValue"
                  value={promotionRowData.discountValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if ((promotionRowData.promotionType === 'percentageDiscount' || 
                         (promotionRowData.promotionType === 'earlyBuyerDiscount' && 
                          promotionRowData.earlyBuyerDiscountType === 'percentage')) && 
                        Number(val) > 100) {
                      toast.error('Percentage cannot exceed 100%');
                      return;
                    }
                    setPromotionRowData((prevData) => ({ ...prevData, discountValue: val }));
                  }}
                  InputProps={{
                    endAdornment:
                      (promotionRowData.promotionType === 'percentageDiscount' || 
                       (promotionRowData.promotionType === 'earlyBuyerDiscount' && 
                        promotionRowData.earlyBuyerDiscountType === 'percentage'))
                        ? <span style={{ marginLeft: 8 }}>%</span>
                        : <span style={{ marginLeft: 8 }}>XAF</span>,
                  }}
                />
              </Grid>

              {/* Validity Period Start */}
              <Grid item xs={12} sm={6}>
                <Typography fontSize="13px" fontWeight={500} mb={1}>
                  Validity Period Start
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="validityPeriodStart"
                  value={promotionRowData.validityPeriodStart}
                  onChange={handlePromotionUpdateChange}
                />
              </Grid>

              {/* Validity Period End */}
              <Grid item xs={12} sm={6}>
                <Typography fontSize="13px" fontWeight={500} mb={1}>
                  Validity Period End
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="validityPeriodEnd"
                  value={promotionRowData.validityPeriodEnd}
                  onChange={handlePromotionUpdateChange}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Typography fontSize="13px" fontWeight={500} mb={1}>
                  Status
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  name="status"
                  value={promotionRowData.status || ''}
                  onChange={handlePromotionUpdateChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inActive">In Active</MenuItem>
                  <MenuItem value="block">Block</MenuItem>
                </Select>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box
              mt={4}
              display="flex"
              gap={2}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: '#0B2E4C',
                  color: '#fff',
                  px: 4,
                  '&:hover': {
                    backgroundColor: '#093b65',
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#D9D9D9',
                  color: '#000',
                  px: 4,
                  '&:hover': {
                    backgroundColor: '#c0c0c0',
                  },
                }}
                onClick={handleCancelModify}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
}