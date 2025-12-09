import { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Box, Button, Input, TextField, Typography } from '@mui/material';

import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import type { AppDispatch } from 'src/redux/store';
import { eventCustomizationPageFetch, eventCustomizationPageUpdate } from 'src/redux/actions/event.action';

export const EventCustomization = ({ eventId }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [primaryColor, setPrimaryColor] = useState('#072F4A');
  const [secondaryColor, setSecondaryColor] = useState('#3F51B5');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [eventLogoPreview, setEventLogoPreview] = useState<string | null>(null);
  const [portraitImagePreview, setPortraitImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventBannerRef = useRef<HTMLInputElement>(null);
  const portraitImageRef = useRef<HTMLInputElement>(null);

  // Fetch existing customization on event change
  useEffect(() => {
    const fetchEventCustomization = async () => {
      if (!eventId) return; 

      const result = await dispatch(eventCustomizationPageFetch(eventId));
      if ('customization' in result && result.status === 200) {
        const customization = result.customization;

        setPrimaryColor(customization.themeColor || '#072F4A');
        setSecondaryColor(customization.customColor || '#3F51B5');

        if (customization?.eventLogo?.url) {
          setEventLogoPreview(customization.eventLogo.url);
        }

        if (customization?.coverImage?.url) {
          setPreviewImage(customization.coverImage.url);
        }

        if (customization?.portraitImage?.url) {
          setPortraitImagePreview(customization.portraitImage.url);
        }
      }
    };

    fetchEventCustomization();
  }, [eventId, dispatch]); 

  const handleEventThemeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setEventLogoPreview(previewUrl);
    }
  };

  useEffect(() => () => {
    if (eventLogoPreview) URL.revokeObjectURL(eventLogoPreview);
  }, [eventLogoPreview]);

  const handleEventBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(previewUrl);
    }
  };

  useEffect(() => () => {
    if (previewImage) URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  const handleSubmit = useCallback(async (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    const eventLogo = fileInputRef.current?.files;
    const eventBanner = eventBannerRef.current?.files;
    const portraitImage = portraitImageRef.current?.files;

    formData.append('themeColor', primaryColor);
    formData.append('customColor', secondaryColor);
    if (eventLogo && eventLogo.length > 0) {
      formData.append('eventLogo', eventLogo[0]);
    }
    if (eventBanner && eventBanner.length > 0) {
      formData.append('coverImage', eventBanner[0]);
    }
    if (portraitImage && portraitImage.length > 0) {
      formData.append('portraitImage', portraitImage[0]);
    }
    const updatedEvent = { _id: eventId, formData };
    const result = await dispatch(eventCustomizationPageUpdate(updatedEvent));

    if (result?.status === 200) {
      toast.success("Changes applied successfully!");
    } else {
      toast.error(result?.message);
    }
  }, [dispatch, primaryColor, secondaryColor, eventId]);

  return (
    <Box boxShadow={3} borderRadius={3} p={{ xs: 2, sm: 3, md: 4 }} bgcolor="white" mt={3}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Box display="flex" justifyContent="space-between">
          <HeadingCommon title="Event Page Customization" />
        </Box>

        {/* Theme Color Selection */}
        <Box mt={3}>
          <HeadingCommon title="Theme Color Selection" baseSize="20px" />
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={4} mt={2}>
            <Box flex={1}>
              <HeadingCommon title="Primary Color:" baseSize="16px" />
              <Input
                type="color"
                name="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                sx={{ width: '100%', height: '40px', border: 'none' }}
              />
            </Box>
            <Box flex={1}>
              <HeadingCommon title="Secondary Color:" baseSize="16px" />
              <Input
                type="color"
                name="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                style={{ width: '100%', height: '40px', border: 'none' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Background Image Upload */}
        <Box mt={4}>
          <HeadingCommon title="Background & Portrait Images" baseSize="20px" />

          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }} 
            gap={2} 
            mt={2}
          >
            {/* Cover Image Box - 60% width on desktop */}
            <Box flex={{ xs: '1 1 100%', sm: '0 0 60%' }}>
              <Input
                type="file"
                fullWidth
                disableUnderline
                name="eventBanner"
                onChange={handleEventBanner}
                inputRef={eventBannerRef}
                inputProps={{ accept: 'image/*' }}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: '8px',
                  marginBottom: 2
                }}
              />
              <Box
                sx={{
                  width: "100%",
                  height: "250px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFF",
                  boxShadow: 2,
                  border: "1px solid #D3D3D3",
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Banner"
                    style={{ width: '100%', borderRadius: 8, maxHeight: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">No Event Banner</Typography>
                )}
              </Box>
            </Box>

            {/* Portrait Image Box - 40% width on desktop */}
            <Box flex={{ xs: '1 1 100%', sm: '0 0 40%' }}>
              <Input
                type="file"
                fullWidth
                disableUnderline
                name="portraitImage"
                inputRef={portraitImageRef}
                inputProps={{ accept: 'image/*' }}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: '8px',
                  marginBottom: 2
                }}
              />
              <Box
                sx={{
                  width: "100%",
                  height: "250px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFF",
                  boxShadow: 2,
                  border: "1px solid #D3D3D3",
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                {portraitImagePreview ? (
                  <img
                    src={portraitImagePreview}
                    alt="Portrait"
                    style={{ width: '100%', borderRadius: 8, maxHeight: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">No Portrait Image</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>


        {/* Event Logo Upload */}
        <Box mt={3}>
          <HeadingCommon title="Event Logo Upload" baseSize="20px" />
          <TextField
            type="file"
            fullWidth
            name="eventLogo"
            onChange={handleEventThemeLogo}
            inputRef={fileInputRef}
            InputProps={{
              sx: {
                borderRadius: '10px',
                border: '1px solid #ccc',
                backgroundColor: '#F9F9F9',
              },
              inputProps: {
                accept: "image/*",
              },
            }}
          />
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFF",
              boxShadow: 2,
              border: "1px solid #D3D3D3",
              overflow: "hidden",
              marginBottom: 4,
            }}
          >
            {eventLogoPreview ? (
              <img src={eventLogoPreview} alt="Logo" style={{ width: '100%', borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <Typography variant="body2" color="textSecondary">No Logo</Typography>
            )}
          </Box>
        </Box>

        {/* Save Button */}
        <Box mt={3}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#072F4A',
              color: 'white',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Apply Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
};
