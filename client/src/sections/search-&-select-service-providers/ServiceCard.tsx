import {
  Box, Typography, Chip, Dialog, Button, DialogTitle, Paper, Divider, useTheme, useMediaQuery, IconButton,
  DialogContent, TextField, FormControlLabel, Collapse, Checkbox, DialogActions, CircularProgress, InputAdornment
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { organizerRequstToProvider } from 'src/redux/actions/service-request';
import { AppDispatch } from 'src/redux/store';
import CloseIcon from '@mui/icons-material/Close';

function truncateHtmlText(html: string, wordCount: number) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = temp.textContent || '';
  const words = text.trim().split(/\s+/);

  if (words.length <= wordCount) {
    return { text, isTruncated: false };
  }

  const truncated = words.slice(0, wordCount).join(' ');
  return {
    text: truncated,
    isTruncated: true,
    fullText: text
  };
}

interface ApiResult {
  status: number;
  type: string;
  message: any;
}

// ServiceCard.tsx (new component)
export function ServiceCard({ event, service, providerId, eventId, disabled = false }: any) {
  console.log('evnt', event);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    orgBudget: 0,
    orgRequirement: '',
    serviceTime: "",
    eventLocation: event?.location || '',
    orgAdditionalRequirement: "",
    providerId
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Add new state for expanded text
  const [isExpanded, setIsExpanded] = useState(false);

  // Process the description text
  const description = truncateHtmlText(service.description || '', 10); // 30 words limit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for orgBudget
    if (name === 'orgBudget') {
      // If the input is empty, set to empty string (will be converted to 0 in state)
      // Or you can set to 0 directly if you prefer
      const numericValue = value === '' ? '' : Number(value);
      setFormData((prev: any) => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append('orgBudget', formData.orgBudget.toString());
      formDataObj.append('eventId', eventId);
      formDataObj.append('serviceRequestId', service._id); // assuming service has an id
      formDataObj.append("serviceTime", formData.serviceTime);
      formDataObj.append("orgRequirement", formData.orgRequirement);
      formDataObj.append("orgAdditionalRequirement", formData.orgAdditionalRequirement);
      formDataObj.append("eventLocation", formData.eventLocation);
      formDataObj.append("providerId", formData.providerId._id);

      const result = await dispatch(organizerRequstToProvider(formDataObj));
      if ((result as ApiResult)?.status === 201) {
        toast.success(result.message);
        handleCloseDialog();
        setFormData({
          orgBudget: 0,
          orgRequirement: '',
          serviceTime: "",
          eventLocation: '',
          orgAdditionalRequirement: "",
          providerId: null
        })
        setTermsAccepted(false)
      } else {
        toast.error(result.message);
      }

    } catch (err) {
      setError(err.message || 'Failed to send request');
      toast.error('Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!service) {
    return (
      <Paper elevation={2} sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <Typography variant="body1" color="text.secondary">
          No service information available
        </Typography>
      </Paper>
    );
  }

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Format the event date for datetime-local input (remove timezone offset)
  const eventDate = event?.date ? new Date(event.date).toISOString().slice(0, 16) : '';

  // Calculate min datetime (current time)
  const minDateTime = new Date();
  // Set seconds and milliseconds to 0 for cleaner display
  minDateTime.setSeconds(0, 0);
  const minDateTimeString = minDateTime.toISOString().slice(0, 16);


  return (
    <>
      <Paper
        elevation={6} // Increased elevation for more depth
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid rgba(0, 0, 0, 0.2)",
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          opacity: disabled ? 0.7 : 1,
          filter: disabled ? 'grayscale(50%)' : 'none',
          transition: 'all 0.3s ease',
          // 3D effect styles
          boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.1),
      0 10px 20px rgba(0, 0, 0, 0.15),
      0 20px 40px rgba(0, 0, 0, 0.2)
    `,
          transform: 'perspective(1000px) rotateX(1deg)',
          '&:hover': {
            transform: disabled ? 'none' : 'perspective(1000px) rotateX(2deg) scale(1.01)',
            boxShadow: disabled ? 'none' : `
        0 8px 12px rgba(0, 0, 0, 0.15),
        0 10px 25px rgba(0, 0, 0, 0.15),
        0 15px 30px rgba(0, 0, 0, 0.2),
        0 25px 50px rgba(0, 0, 0, 0.25)
      `,
          }
        }}
      >
        {/* Status Chip and Service Type */}
        <Box sx={{ mt: 'auto' }} display='flex' justifyContent="space-between">
          <HeadingCommon
            variant="subtitle1"
            mb={1}
            baseSize="15px"
            weight={600}
            title={service.serviceType}
            sx={{ color: disabled ? 'text.disabled' : 'inherit' }}
          />

          <Chip
            label={service.status}
            size="small"
            color={service.status === 'active' ? 'success' : 'default'}
            sx={{
              mb: 0,
              textTransform: 'capitalize',
              opacity: disabled ? 0.7 : 1
            }}
          />
        </Box>

        {/* Service Details */}

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
          color: disabled ? 'text.disabled' : 'inherit'
        }}>
          <LocationOnIcon color={disabled ? 'disabled' : 'action'} sx={{ mr: 1, fontSize: '18px' }} />
          <Typography variant="body2">
            {service.eventLocation}
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          color: disabled ? 'text.disabled' : 'inherit'
        }}>
          <AttachMoneyIcon color={disabled ? 'disabled' : 'action'} sx={{ mr: 1, fontSize: '18px' }} />
          <Typography variant="body2" fontWeight={500}>
            {service.budget}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            color: disabled ? 'text.disabled' : 'inherit'
          }}>
          <Typography
            variant="body2"
            fontWeight={500}
            onClick={() => setOpenGallery(!openGallery)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            Gallery ({service?.images?.length || 0} images)
          </Typography>
        </Box>

        {service.images && service.images.length > 0 && (
          <Dialog
            open={openGallery}
            onClose={() => setOpenGallery(false)}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Gallery
              <IconButton
                onClick={() => setOpenGallery(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{
                height: isMobile ? '70vh' : '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Box
                  component="img"
                  src={service.images[currentImageIndex].url}
                  alt={service.serviceType}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => (prev - 1 + service.images.length) % service.images.length);
                  }}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.5)'
                    }
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => (prev + 1) % service.images.length);
                  }}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.5)'
                    }
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              {/* Thumbnail Strip */}
              <Box sx={{
                display: 'flex',
                gap: 1,
                mt: 2,
                overflowX: 'auto',
                py: 1,
                px: 1
              }}>
                {service.images.map((img: any, index: any) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: currentImageIndex === index ? '2px solid' : '1px solid',
                      borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                      flexShrink: 0
                    }}
                  >
                    <Box
                      component="img"
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        )}

        {/* Description */}
        <Divider sx={{ my: 1 }} />
        <Box sx={{
          mb: 2,
          color: disabled ? 'text.disabled' : 'text.secondary'
        }}>
          <Typography variant="body2">
            <Typography variant="body2" paragraph>
              {isExpanded ? description.fullText || description.text : description.text}
              {description.isTruncated && (
                <Button
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{
                    ml: 1,
                    minWidth: 0,
                    padding: 0,
                    textTransform: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </Button>
              )}
            </Typography>
          </Typography>
        </Box>

        {/* Request Button - Now opens dialog instead of sending directly */}
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<CheckCircleIcon />}
          onClick={handleOpenDialog}
          sx={{
            mt: 1,
            backgroundColor: disabled ? '#e0e0e0' : '#4CAF50',
            color: disabled ? '#9e9e9e' : 'white',
            '&:hover': {
              backgroundColor: disabled ? '#e0e0e0' : '#388E3C',
              boxShadow: 'none'
            },
            '& .MuiSvgIcon-root': {
              color: disabled ? '#9e9e9e' : 'white'
            }
          }}
        >
          {disabled ? 'Select an event first' :
            service.status === 'active' ? 'Request Service' : 'Not Available'}
        </Button>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <form onSubmit={handleSaveRequest}>
          <DialogTitle>Request Services Form</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                required
                type="number"  // Changed from "text" to "number" for currency input
                fullWidth
                name="orgBudget"
                label="Negotiation Price"
                value={formData.orgBudget === 0 ? '' : formData.orgBudget}
                onChange={handleInputChange}
                placeholder="Enter your budget..."
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      XAF
                    </InputAdornment>
                  ),
                  inputProps: {
                    min: 0  // Ensures only positive numbers
                  }
                }}
              />
            </Box>
            <TextField
              required
              fullWidth
              label="Date and Time of the Service"
              type="datetime-local"
              margin="normal"
              name="serviceTime"
              value={formData.serviceTime}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: minDateTimeString, // Prevent selecting past dates/times
                max: eventDate, // Prevent selecting dates after the event
              }}
              disabled={disabled}
            />
            <TextField
              required
              fullWidth
              label="Event Location"
              margin="normal"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleInputChange}
            />

            <TextField
              required
              type="text"
              fullWidth
              multiline
              rows={4}
              name="orgRequirement"
              label="Requirements"
              value={formData.orgRequirement}
              onChange={handleInputChange}
              placeholder="Write your requirements..."
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Additional Options"
              multiline
              rows={4}
              margin="normal"
              name="orgAdditionalRequirement"
              value={formData.orgAdditionalRequirement}
              onChange={handleInputChange}
            />
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    color="primary"
                    required
                  />
                }
                label="I agree to the terms and conditions"
              />
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isLoading || !termsAccepted}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}