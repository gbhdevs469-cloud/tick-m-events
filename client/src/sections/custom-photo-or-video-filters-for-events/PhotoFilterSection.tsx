import { useEffect, useState } from 'react';
import { Box, MenuItem, Select, Typography, Button, FormControl, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import axios from 'src/redux/helper/axios';
import { RootState } from 'src/redux/store';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';

import { useFrame } from './view/FrameContext';

export function PhotoFilterSection() {
  const { _id } = useSelector((state: RootState) => state.auth.user);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [isCustom, setIsCustom] = useState(false);
  const [userFrames, setUserFrames] = useState<string[]>([]);
  const frames = selectedEvent?.customPhotoFrame?.frameUrls || [];
  const frameList = Array.isArray(frames) ? frames : [frames];
  const allFrames = [...frameList, ...userFrames];
  const [customFilters, setCustomFilters] = useState({
    brightness: 100,
    contrast: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
  });
  const { selectedFrame, setSelectedFrame } = useFrame();
  const [frameSize, setFrameSize] = useState({ width: 400, height: 300 }); // default fallback
  const buildCustomFilter = () => {
    const { brightness, contrast, blur, grayscale, sepia } = customFilters;
    return `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%)`;
  };

  const appliedFilter = isCustom ? buildCustomFilter() : selectedFilter;



  const handleFrameUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let hasTransparency = false;
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
              hasTransparency = true;
              break;
            }
          }

          if (hasTransparency) {
            const frameUrl = URL.createObjectURL(file);
            setUserFrames((prev) => [...prev, frameUrl]);
            toast.success('Frame uploaded successfully!');
          } else {
            toast.error('Only PNGs with transparency are allowed.');
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      toast.warning('Only PNG files are allowed.');
    }
  };

  const handleDeleteFrame = (frameUrl: string) => {
    setUserFrames((prev) => prev.filter((url) => url !== frameUrl));
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get(`/event-order/user/${_id}`);
        const tickets = response.data;
        const uniqueEvents = Array.from(
          new Map(
            tickets.map((ticket: any) => {
              const eventId = ticket.eventDetails._id;
              return [
                eventId,
                {
                  ...ticket.eventDetails,
                  customPhotoFrame: ticket.customPhotoFrame ?? null, 
                },
              ];
            })
          ).values()
        );

     
        setEvents(uniqueEvents);
      } catch (error) {
         toast.error("Failed to fetch events. Please try again.");
      }
    }

    if (_id) {
      fetchEvents();
    }
  }, [_id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const filterOptions = [
    { label: 'None', value: 'none' },
    { label: 'Grayscale', value: 'grayscale(100%)' },
    { label: 'Sepia', value: 'sepia(100%)' },
    { label: 'Blur', value: 'blur(4px)' },
    { label: 'Brightness', value: 'brightness(150%)' },
    { label: 'Contrast', value: 'contrast(200%)' },
    { label: 'Custom', value: 'custom' },
  ];
 


useEffect(() => {
  if (!selectedFrame) return;

  const img = new Image();
  img.onload = () => {
    setFrameSize({ width: img.naturalWidth, height: img.naturalHeight });
  };
  img.src = selectedFrame;
}, [selectedFrame]);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 2.5,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        p: { xs: 2, sm: 4 },
        mt: 4,
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <FormControl fullWidth size="small" sx={{ maxWidth: 250 }}>
          <InputLabel>Select Event</InputLabel>
          <Select
            value={selectedEvent?._id || ''}
            onChange={(e) => {
              const selected = events.find(ev => ev._id === e.target.value);
              setSelectedEvent(selected || null);
            }}
            label="Select Event"
          >
            {events.map((event: any) => (
              <MenuItem key={event._id} value={event._id}>
                {event.eventName} ({event.date})
              </MenuItem>
            ))}
          </Select>

        </FormControl>
      </Box>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <HeadingCommon variant="h5" title="Custom Photo or Video Filter" weight={600} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {allFrames.length > 0 ? (
            allFrames.map((frameUrl: string, index: number) => {
              const isUserFrame = userFrames.includes(frameUrl);
              return (
                <Box
                  key={index}
                  sx={{ position: "relative", display: "inline-block" }}
                >
                  <Box
                    component="img"
                    src={frameUrl}
                    alt={`Frame ${index + 1}`}
                    onClick={() => setSelectedFrame(frameUrl)}
                    sx={{
                      width: 120,
                      height: 140,
                      objectFit: "contain",
                      borderRadius: 2,
                      boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                      border: selectedFrame === frameUrl ? "3px solid #0B2E4C" : "none",
                      cursor: "pointer",
                    }}
                  />
                  {isUserFrame && (
                    <Button
                      onClick={() => handleDeleteFrame(frameUrl)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        minWidth: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#fff",
                        color: "#000",
                        fontWeight: "bold",
                        padding: 0,
                        lineHeight: 1,
                        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                        "&:hover": { background: "#f5f5f5" },
                      }}
                    >
                      ✕
                    </Button>
                  )}
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="#888">
              No Frame Available
            </Typography>
          )}


          {/* Upload new frame option */}
          <Button
            component="label"
            variant="outlined"
            sx={{ width: 120, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            + Add Frame
            <input type="file" hidden accept="image/png" onChange={handleFrameUpload} />
          </Button>
        </Box>



        {/* <Button component="label" variant="outlined" sx={{ mt: 1 }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button> */}


      </Box>
    </Box>
  );
}
