import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Box, Button, Checkbox, FormControlLabel, Grid, Input, Typography } from '@mui/material';

import axios from "../../redux/helper/axios";

export const CustomPhotoVideoFilter = ({ __events }: any) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filterImages, setFilterImages] = useState<string[]>([
    '/assets/images/cover/7.png',
    '/assets/images/cover/8.png',
    '/assets/images/cover/9.png',
    '/assets/images/cover/10.png',
  ]);
  const [frameAspectRatio, setFrameAspectRatio] = useState<number | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isCustomFilterEnabled, setIsCustomFilterEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 🆕 Add loading state

  useEffect(() => {
    // If photoFrame exists, use its frameUrls, otherwise use empty list
    if (__events?.photoFrame?.frameUrls?.length) {
      setFilterImages(__events.photoFrame.frameUrls);
    } else {
      setFilterImages([]);
    }

    // Also reset selected filter
    setSelectedFilter(null);
  }, [__events?.photoFrame]);

  const checkImageTransparency = (file: File): Promise<boolean> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        for (let i = 3; i < imageData.length; i += 4) {
          if (imageData[i] < 255) {
            resolve(true); // Transparent pixel found
            return;
          }
        }

        resolve(false); // No transparency
      };

      img.src = URL.createObjectURL(file);
    });


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const results = await Promise.all(
      fileArray.map(async (file) => {
        // Only check for PNG type, ignore size limits
        if (file.type !== "image/png") {
          toast.warning(`${file.name} is not a PNG file.`);
          return null;
        }

        const isTransparent = await checkImageTransparency(file);
        if (!isTransparent) {
          toast.warning(`${file.name} is not transparent.`);
          return null;
        }

        return file;
      })
    );

    const validTransparentPngs = results.filter((file): file is File => file !== null);

    if (validTransparentPngs.length === 0) return;

    setFilesToUpload((prev) => [...prev, ...validTransparentPngs]);

    const newPreviewUrls = validTransparentPngs.map((file) =>
      URL.createObjectURL(file)
    );
    setFilterImages((prev) => [...prev, ...newPreviewUrls]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const eventCoverImage = __events?.customization?.eventLogo?.url || '/assets/images/cover/1.png';

  const handleApplyFilter = async () => {
    if (!__events?._id) {
      toast.warning("Please select an event before applying.");
      return;
    }

    if (filesToUpload.length === 0) {
      toast.warning("Please select filter images to apply.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      const uploadResults = await Promise.all(
        filesToUpload.map(async (file) => {
          const formData = new FormData();
          formData.append("eventId", __events?._id);
          formData.append("frame", file);

          try {
            const response = await axios.post("/custom-frame/save-frame", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 30000,
            });

            if (response.status === 200 || response.status === 201) {
              const frameData = response.data?.data;
              const latestUrl = frameData?.frameUrls?.slice(-1)[0];
              return { success: true, url: latestUrl, fileName: file.name };
            }
            toast.error(`Failed to upload ${file.name}`);
            return { success: false, url: null, fileName: file.name, error: `Status: ${response.status}` };

          } catch (err: any) {
            let errorMessage = "Upload failed";
            if (err.code === 'ECONNABORTED') {
              errorMessage = "Upload timeout - check your connection";
            } else if (err.response?.status === 413) {
              errorMessage = "File too large";
            } else if (err.response?.status === 400) {
              errorMessage = "Invalid file format";
            } else {
              errorMessage = err?.response?.data?.message || "Upload failed";
            }

            toast.error(`${file.name}: ${errorMessage}`);
            return { success: false, url: null, fileName: file.name, error: errorMessage };
          }
        })
      );

      // Process successful uploads
      const successfulUploads = uploadResults.filter(result => result.success && result.url);
      successfulUploads.forEach(result => {
        if (result.url) uploadedUrls.push(result.url);
      });

      if (uploadedUrls.length > 0) {
        const tempUrls = filterImages.filter(url => url.startsWith('blob:'));
        const permanentUrls = filterImages.filter(url => !url.startsWith('blob:'));

        tempUrls.forEach(url => URL.revokeObjectURL(url));
        setFilterImages([...permanentUrls, ...uploadedUrls]);

        toast.success(`Successfully uploaded ${uploadedUrls.length} file(s)`);
      } else {
        toast.warning("No files were successfully uploaded.");
      }

      setFilesToUpload([]);

    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const applySelectedFilter = async () => {
    if (!__events?._id) {
      toast.warning("Please select an event before applying.");
      return;
    }
    if (!selectedFilter) {
      toast.warning("Please select a filter template.");
      return;
    }

    try {
      const response = await axios.put('/custom-frame/select-frame', {
        eventId: __events?._id,
        selectedFrameUrl: selectedFilter,
      });

      if (response.status === 200) {
        toast.success("Selected filter applied successfully!");
      } else {
        toast.error("Failed to apply selected filter.");
      }
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || "Applying filter failed.";
      toast.error(backendMessage);
    }
  };


  // 🆕 Always call delete API for all images
  const handleDeleteFilter = async (filename: string, index: number) => {
    if (!__events?._id) {
      toast.warning("No event selected.");
      return;
    }

    try {
      const res = await axios.delete("/custom-frame/delete-frame", {
        params: {
          eventId: __events?._id,
          frameUrl: filename,
        },
      });

      if (res.status === 200) {
        toast.success("Filter deleted successfully!");
        // Remove from local state
        setFilterImages((prev) => prev.filter((_, i) => i !== index));
        setFilesToUpload((prev) => prev.filter((_, i) => i !== index));

        // Clean up blob URLs to free memory
        if (filename.startsWith('blob:')) {
          URL.revokeObjectURL(filename);
        }
      } else {
        toast.error("Failed to delete filter.");
      }
    } catch (error) {
      toast.error("Error deleting filter.");
    }

    // Clear selection if deleted filter was selected
    if (selectedFilter === filename) {
      setSelectedFilter(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box boxShadow={3} borderRadius={3} p={{ xs: 2, sm: 3, md: 4 }} bgcolor="white" mt={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontSize={{ xs: 15, sm: 20, md: 26 }} fontWeight={500}>
          Custom Photo & Video Filters
        </Typography>
      </Box>
      {/* Enable Checkbox */}
      <Box mb={2}>
        <FormControlLabel
          control={<Checkbox
            checked={isCustomFilterEnabled}
            onChange={(e) => setIsCustomFilterEnabled(e.target.checked)} />}
          label="Enable Custom Filters"
        />
      </Box>

      <Box
        sx={{
          opacity: isCustomFilterEnabled ? 1 : 0.5,
          pointerEvents: isCustomFilterEnabled ? "auto" : "none",
        }}>
        {/* Filter Templates */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontSize={{ xs: 12, sm: 16, md: 20 }} fontWeight={500} gutterBottom>
            Choose Filter Template
          </Typography>
          <Grid container spacing={2}>
            <Grid container spacing={2}>
              {filterImages.map((filename, index) => (
                <Grid item xs={6} sm={3} mt={3} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: selectedFilter === filename ? '3px solid #0B2E4C' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFilter(filename, index); // 🆕 Use the new delete function
                      }}
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        background: '#fff',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#333',
                        zIndex: 3,
                        cursor: 'pointer',
                        boxShadow: 1,
                        '&:hover': {
                          background: '#f0f0f0',
                        },
                      }}
                    >
                      ×
                    </Box>

                    {/* Image */}
                    <Box onClick={() => setSelectedFilter(filename)}>
                      <img
                        src={filename}
                        alt={`Filter ${index + 1}`}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>

        {/* Upload Custom Filter */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontSize={{ xs: 12, sm: 16, md: 20 }} fontWeight={500} gutterBottom>
            Upload Custom Filter
          </Typography>

          {/* 🆕 Instruction Text */}
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={{ xs: 12, sm: 14 }}
            mb={1}
          >
            Please upload <strong>PNG images with a transparent background</strong>.
          </Typography>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
            <Input
              inputRef={fileInputRef}
              type="file"
              inputProps={{ multiple: true, accept: "image/png", }}
              onChange={handleFileUpload}
              disableUnderline
              sx={{ border: "1px solid black", padding: "8px", borderRadius: 2 }}
            />
            <Button
              variant="contained"
              disabled={filesToUpload.length === 0 || isUploading}
              sx={{
                backgroundColor: filesToUpload.length === 0 || isUploading ? "#ccc" : "#0B2E4C",
                color: "#fff",
                padding: { xs: "8px", sm: "11px" }, // 🆕 Responsive padding
                width: { xs: "100%", sm: "70%" },   // 🆕 Full width on mobile
                fontSize: { xs: "14px", sm: "16px" },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666',
                }
              }}
              onClick={handleApplyFilter}
            >
              {isUploading ? 'Uploading...' : `Apply ${filesToUpload.length} File(s)`}
            </Button>
          </Box>
        </Box>

        {/* Live Preview */}
        <Box mb={3}>
          <Typography
            variant="subtitle1"
            fontSize={{ xs: 12, sm: 16, md: 20 }}
            fontWeight={500}
            gutterBottom
          >
            Live Preview
          </Typography>

          <Box
            bgcolor="#E5E5E5"
            borderRadius={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
            sx={{
              aspectRatio: frameAspectRatio ? `${frameAspectRatio}` : '1 / 1',
              maxWidth: 320,
              mx: 'auto',
              width: '100%',
            }}
          >

            {selectedFilter ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  maxWidth: 300,
                  maxHeight: 300,
                }}
              >
                <img
                  src={eventCoverImage}
                  alt="Base Preview"
                  style={{
                    width: '45%',
                    height: '70%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                />

                {/* Frame overlay */}
                <img
                  src={selectedFilter}
                  alt="Frame Overlay"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const ratio = img.naturalWidth / img.naturalHeight;
                    setFrameAspectRatio(ratio);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />

              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No filter selected
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#072F4A',
            color: 'white',
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={applySelectedFilter}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};