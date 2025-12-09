import React, { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import CropIcon from '@mui/icons-material/Crop';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import { toast } from 'react-toastify';
import "react-image-crop/dist/ReactCrop.css";
import { PageTitleSection } from "src/components/page-title-section";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import "react-quill/dist/quill.snow.css";
import { EventInformation } from "../event-information";
import { SecurityAndConfirmation } from "../security-&-confirm";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function EventDetailsView() {
  const [eventLogo, setEventLogo] = useState<string | null>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState('');
  const [showCrop, setShowCrop] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ye 
  const [portraitLogo, setPortraitLogo] = useState<string | null>(null);
  const [showPortraitCrop, setShowPortraitCrop] = useState(false);
  const [portraitCrop, setPortraitCrop] = useState<Crop>();
  const [completedPortraitCrop, setCompletedPortraitCrop] = useState<PixelCrop>();
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const portraitCanvasRef = useRef<HTMLCanvasElement>(null);

  // 
  const handleEventThemeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // Create object URL for preview
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setEventLogo(previewUrl);
      setImgSrc(previewUrl);
    }
  };

  // ye 
  const handlePortraitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPortraitLogo(previewUrl);
    }
  };

  // ye bhi
  const handleTogglePortraitCrop = () => {
    setShowPortraitCrop(!showPortraitCrop);
    if (!showPortraitCrop && portraitImgRef.current) {
      const { width, height } = portraitImgRef.current;
      setPortraitCrop(centerAspectCrop(width, height, 3 / 4)); // Adjust aspect ratio as needed
    }
  };

  const handlePortraitCropComplete = (newCrop: PixelCrop) => {
    setCompletedPortraitCrop(newCrop);
  };

  const handleApplyPortraitCrop = () => {
    if (portraitImgRef.current && portraitCanvasRef.current && completedPortraitCrop) {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        portraitImgRef.current,
        completedPortraitCrop.x,
        completedPortraitCrop.y,
        completedPortraitCrop.width,
        completedPortraitCrop.height,
        0,
        0,
        600,
        800
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const newPreviewUrl = URL.createObjectURL(blob);
          if (portraitLogo) URL.revokeObjectURL(portraitLogo);
          setPortraitLogo(newPreviewUrl);
          setShowPortraitCrop(false);
        }
      }, 'image/png', 1);
    }
  };

  const handleDownloadPortrait = () => {
    if (!portraitLogo) return;
    const link = document.createElement('a');
    link.href = portraitLogo;
    link.download = 'portrait-banner.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // yha tak


  const handleDownload = () => {
    if (!eventLogo) return;
    const link = document.createElement('a');
    link.href = eventLogo;
    link.download = 'event-banner.png'; // or extract filename from the original file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleCrop = () => {
    setShowCrop(!showCrop);
    if (!showCrop && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  };

  const handleCropComplete = (newCrop: PixelCrop) => {
    setCompletedCrop(newCrop);
  };

  const handleApplyCrop = async () => {
    if (imgRef.current && previewCanvasRef.current && completedCrop) {
      try {
        // Create a new canvas for the cropped image
        const canvas = document.createElement('canvas');
        canvas.width = 1500; // Set to your desired dimensions
        canvas.height = 536;

        // Get the context
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw the cropped image
        ctx.drawImage(
          imgRef.current,
          completedCrop.x,
          completedCrop.y,
          completedCrop.width,
          completedCrop.height,
          0,
          0,
          1500,
          536
        );

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const newPreviewUrl = URL.createObjectURL(blob);

            // Clean up previous URLs
            if (eventLogo) URL.revokeObjectURL(eventLogo);
            if (imgSrc) URL.revokeObjectURL(imgSrc);

            // Update both states
            setEventLogo(newPreviewUrl);
            setImgSrc(newPreviewUrl);
            setShowCrop(false);

            // Update the file input with the cropped image
            if (fileInputRef.current) {
              const croppedFile = new File([blob], 'cropped-image.png', { type: 'image/png' });
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(croppedFile);
              fileInputRef.current.files = dataTransfer.files;
            }
          }
        }, 'image/png', 1);
      } catch (error) {
        console.error('Cropping error:', error);
        toast.error('Failed to apply crop');
      }
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => () => {
    if (eventLogo) {
      URL.revokeObjectURL(eventLogo);
    }
    if (imgSrc) {
      URL.revokeObjectURL(imgSrc);
    }
  }, [eventLogo, imgSrc]);

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Title & Search Bar */}
      <PageTitleSection
        title="Create and Manage My Events"
        desc=""
      />

      {/* Event Banner Preview */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            height: { xs: '200px', sm: '250px', md: '320px' },
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            position: 'relative'
          }}
        >
          {eventLogo ? (
            <>
              {showCrop ? (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                  aspect={16 / 9}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '320px',
                      display: 'block' // Ensure proper rendering
                    }}
                    onLoad={handleImageLoad}
                  />
                </ReactCrop>
              ) : (
                <img
                  key={eventLogo} // Force re-render when URL changes
                  src={eventLogo}
                  alt="Event Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "bottom",
                    borderRadius: 3,
                    display: 'block' // Ensure proper rendering
                  }}
                />
              )}

              <Box sx={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 1 }}>
                <HeadingCommon title="Minimum dimensions: 1000*666 pixels" baseSize="12px" color="red" />
              </Box>
              <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                <IconButton onClick={handleDownload} sx={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <DownloadIcon />
                </IconButton>
                <IconButton onClick={handleToggleCrop} sx={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <CropIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <HeadingCommon title="No Banner select" variant="body2" />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: { xs: 150, md: '35%' },
            height: '320px',
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            bgcolor: 'background.paper',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            position: 'relative'
          }}
        >
          {portraitLogo ? (
            <>
              {showPortraitCrop ? (
                <ReactCrop
                  crop={portraitCrop}
                  onChange={(c) => setPortraitCrop(c)}
                  onComplete={handlePortraitCropComplete}
                  aspect={3 / 4}
                >
                  <img
                    ref={portraitImgRef}
                    src={portraitLogo}
                    alt="Portrait"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain"
                    }}
                    onLoad={(e) => {
                      const { width, height } = e.currentTarget;
                      setPortraitCrop(centerAspectCrop(width, height, 3 / 4));
                    }}
                  />
                </ReactCrop>
              ) : (
                <img
                  src={portraitLogo}
                  alt="Portrait Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 3,
                    display: 'block'
                  }}
                />
              )}
              <Box sx={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 1 }}>
                <HeadingCommon title="Minimum dimensions: 500*500 pixels" baseSize="12px" color="red" />
              </Box>
              <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                <IconButton onClick={handleDownloadPortrait} sx={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <DownloadIcon />
                </IconButton>
                <IconButton onClick={handleTogglePortraitCrop} sx={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <CropIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <HeadingCommon title="No Portrait Image" variant="body2" />
            </Box>
          )}
        </Box>

      </Box>
      {showCrop && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, gap: 2 }}>
          <Button variant="contained" onClick={handleApplyCrop}>
            Apply Crop
          </Button>
          <Button variant="outlined" onClick={() => setShowCrop(false)}>
            Cancel
          </Button>
        </Box>
      )}
      {showPortraitCrop && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, gap: 2 }}>
          <Button variant="contained" onClick={handleApplyPortraitCrop}>
            Apply Portrait Crop
          </Button>
          <Button variant="outlined" onClick={() => setShowPortraitCrop(false)}>
            Cancel
          </Button>
        </Box>
      )}
      <canvas
        ref={previewCanvasRef}
        style={{
          display: 'none',
          objectFit: 'contain',
          width: '100%',
          height: '320px',
        }}
      />
      <canvas
        ref={portraitCanvasRef}
        style={{ display: 'none' }}
      />

      {/* My section */}
      <EventInformation handleEventThemeLogo={handleEventThemeLogo} fileInputRef={fileInputRef} handlePortraitImage={handlePortraitImage} />

      {/* security & Confirmation */}
      <SecurityAndConfirmation />
    </Box>
  );
}
