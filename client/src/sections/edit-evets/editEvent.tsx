import { useState, useEffect, useRef } from 'react';
import {
  TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl, Typography,
  Checkbox, FormControlLabel, Box, Divider, RadioGroup, Radio, FormLabel
} from '@mui/material';
import { useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { editEventsFetch, updateEvent } from 'src/redux/actions/organizer/editEventAction';
import { AppDispatch } from 'src/redux/store';

import { EventData } from './utills';

interface EditEventFormProps {
  eventData: EventData;
  onSuccess: () => void;
}

export function EditEventForm({ eventData, onSuccess }: EditEventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState(eventData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quillRef = useRef<ReactQuill>(null);


  useEffect(() => {
    setFormData(eventData);
  }, [eventData]);

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      event: {
        ...prev.event,
        description: content
      }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle nested checkbox fields
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData((prev: any) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (name.startsWith('organizer.socialMedia.')) {
      // Special handling for social media fields
      const socialMediaField = name.split('.')[2]; // whatsapp, linkedin, etc.
      setFormData(prev => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          socialMedia: {
            ...prev.organizer.socialMedia,
            [socialMediaField]: value
          }
        }
      }));
    } else if (name.includes('.')) {
      // Handle other nested fields
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (e: any) => {
  const { name, value } = e.target;
  
  if (name.includes('.')) {
    // Handle nested fields like event.eventType, event.format, etc.
    const [parent, child] = name.split('.');
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

  const handleTicketChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedTickets = [...formData.tickets.tickets];

    if (type === 'checkbox') {
      updatedTickets[index] = {
        ...updatedTickets[index],
        [name]: checked
      };
    } else {
      updatedTickets[index] = {
        ...updatedTickets[index],
        [name]: value
      };
    }

    setFormData(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        tickets: updatedTickets
      }
    }));
  };

  const handleRefundPolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        refundPolicy: {
          ...prev.tickets.refundPolicy,
          [name]: type === 'checkbox' ? checked : value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call your API to update the event
      await dispatch(updateEvent(formData?.event?._id, formData));
      onSuccess();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    dispatch(editEventsFetch());
  }, [dispatch]);
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>

      {/* Event Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Event Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="event.eventName"
              label="Event Name"
              fullWidth
              value={formData.event.eventName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="event.date"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.event.date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="event.time"
              label="Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.event.time}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                name="event.eventType"
                value={formData.event.eventType}
                label="Event Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="event.location"
              label="Location"
              fullWidth
              value={formData.event.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                name="event.format"
                value={formData.event.format}
                label="Format"
                onChange={handleSelectChange}
              >
                <MenuItem value="In-person">In-person (with a physical location)</MenuItem>
                <MenuItem value="Online">Online (with a connection link or streaming platform)</MenuItem>
                <MenuItem value="Hybrid">Hybrid (combining both formats)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              mt: { xs: 2, sm: 2, md: 0 },
              mb: { xs: 5, sm: 2, md: 2 }
            }}
          >
           <div translate="no" className="notranslate" data-nosnippet>
              <ReactQuill
                placeholder='Enter your event description (required)'
                theme="snow"
                value={formData.event.description}
                onChange={handleDescriptionChange} // Use the new handler
                style={{
                  height: '120px', // Increased height for better editing
                  margin: "10px 0px 40px 0px", // Adjusted margin
                  borderRadius: '4px'
                }}
                ref={quillRef}
              />
            </div>
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              required
              name="event.description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.event.description}
              onChange={handleChange}
            />
          </Grid> */}
        </Grid>
      </Box>

      {/* Customization Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Customization
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="customization.themeColor"
              label="Theme Color"
              type="color"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.customization.themeColor}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="customization.customColor"
              label="Custom Color"
              type="color"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.customization.customColor}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frame</InputLabel>
              <Select
                name="customization.frame"
                value={formData.customization.frame}
                label="Frame"
                onChange={handleSelectChange}
              >
                <MenuItem value="triangle">Triangle</MenuItem>
                <MenuItem value="circle">Circle</MenuItem>
                <MenuItem value="square">Square</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Tickets Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tickets
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="tickets.isPurchaseDeadlineEnabled"
                  checked={formData.tickets.isPurchaseDeadlineEnabled}
                  onChange={handleChange}
                />
              }
              label="Enable Purchase Deadline"
            />
          </Grid>
          {formData.tickets.isPurchaseDeadlineEnabled && (
            <Grid item xs={12} sm={6}>
              <TextField
                name="tickets.purchaseDeadlineDate"
                label="Purchase Deadline Date"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.tickets.purchaseDeadlineDate}
                onChange={handleChange}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Methods</InputLabel>
              <Select
                name="tickets.paymentMethods"
                value={formData.tickets.paymentMethods}
                label="Payment Methods"
                onChange={handleSelectChange}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Mobile Payment">Mobile Payment</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="tickets.isRefundPolicyEnabled"
                  checked={formData.tickets.isRefundPolicyEnabled}
                  onChange={handleChange}
                />
              }
              label="Enable Refund Policy"
            />
          </Grid>
          {formData.tickets.isRefundPolicyEnabled && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullRefund"
                      checked={formData.tickets.refundPolicy.fullRefund}
                      onChange={handleRefundPolicyChange}
                    />
                  }
                  label="Full Refund"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partialRefund"
                      checked={formData.tickets.refundPolicy.partialRefund}
                      onChange={handleRefundPolicyChange}
                    />
                  }
                  label="Partial Refund"
                />
              </Grid>
              {formData.tickets.refundPolicy.partialRefund && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="partialRefundPercent"
                    label="Partial Refund Percentage"
                    type="number"
                    fullWidth
                    value={formData.tickets.refundPolicy.partialRefundPercent}
                    onChange={handleRefundPolicyChange}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="noRefundAfterDate"
                      checked={formData.tickets.refundPolicy.noRefundAfterDate}
                      onChange={handleRefundPolicyChange}
                    />
                  }
                  label="No Refund After Date"
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Ticket Types
            </Typography>
            {formData.tickets.tickets.map((ticket, index) => (
              <Box key={ticket._id} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      name="ticketType"
                      label="Ticket Type"
                      fullWidth
                      value={ticket.ticketType}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTicketChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      name="price"
                      label="Price"
                      fullWidth
                      value={ticket.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTicketChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      name="totalTickets"
                      label="Total Tickets"
                      type="number"
                      fullWidth
                      value={ticket.totalTickets}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTicketChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      value={ticket.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTicketChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isLimitedSeat"
                          checked={ticket.isLimitedSeat}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTicketChange(index, e)}
                        />
                      }
                      label="Limited Seats"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isLinkPramotion"
                          checked={ticket.isLinkPramotion}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTicketChange(index, e)}
                        />
                      }
                      label="Link Promotion"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>

      {/* Visibility Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Visibility
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Visibility Settings
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="visibility.visibilityType"
                value={formData.visibility.visibilityType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public Event"
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Private Event"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Promotion and Highlight
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Homepage Highlighting</FormLabel>
                  <RadioGroup
                    row
                    name="visibility.promotionAndHighlight.homepageHighlighting"
                    value={formData.visibility.promotionAndHighlight.homepageHighlighting}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        visibility: {
                          ...prev.visibility,
                          promotionAndHighlight: {
                            ...prev.visibility.promotionAndHighlight,
                            homepageHighlighting: e.target.value === 'true'
                          }
                        }
                      }));
                    }}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Auto Share on Social Media</FormLabel>
                  <RadioGroup
                    row
                    name="visibility.promotionAndHighlight.autoShareOnSocialMedia"
                    value={formData.visibility.promotionAndHighlight.autoShareOnSocialMedia}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        visibility: {
                          ...prev.visibility,
                          promotionAndHighlight: {
                            ...prev.visibility.promotionAndHighlight,
                            autoShareOnSocialMedia: e.target.value === 'true'
                          }
                        }
                      }));
                    }}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="visibility.status"
                value={formData.visibility.status}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="publish">Publish</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </Box>

      {/* Organizer Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Organizer Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="organizer.name"
              label="Organizer Name"
              fullWidth
              value={formData.organizer.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="organizer.number"
              label="Phone Number"
              fullWidth
              value={formData.organizer.number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="organizer.email"
              label="Email"
              type="email"
              fullWidth
              value={formData.organizer.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="organizer.website"
              label="Website"
              fullWidth
              value={formData.organizer.website}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Social Media
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="organizer.socialMedia.whatsapp"
                  label="WhatsApp"
                  fullWidth
                  value={formData.organizer?.socialMedia?.whatsapp}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="organizer.socialMedia.linkedin"
                  label="LinkedIn"
                  fullWidth
                  value={formData.organizer?.socialMedia?.linkedin}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="organizer.socialMedia.facebook"
                  label="Facebook"
                  fullWidth
                  value={formData.organizer?.socialMedia?.facebook}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="organizer.socialMedia.tiktok"
                  label="TikTok"
                  fullWidth
                  value={formData.organizer?.socialMedia?.tiktok}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ px: 4, py: 1.5 }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </form>
  );
}