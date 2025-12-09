import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Button, Grid, IconButton, useMediaQuery, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import {
  CameraAlt,
  Videocam,
  FlipCameraIos,
  Download,
  Replay,
  FiberManualRecord,
  Stop,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { useFrame } from './view/FrameContext';


interface FilterCardProps {
  title: string;
  isVideoMode: boolean;
  onShare?: (img: string) => void;
  frameSize: { width: number; height: number };
}

export const FilterCard: React.FC<FilterCardProps> = ({ title, isVideoMode, onShare, frameSize }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { selectedFrame } = useFrame();
  const [mode, setMode] = useState(isVideoMode ? 'video' : 'photo');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showFilterEdit, setShowFilterEdit] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [currentCamera, setCurrentCamera] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null); // New ref for preview video
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [cameraRestartTrigger, setCameraRestartTrigger] = useState(0);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // New state for video playback
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const previewWidth = '100%';
  const previewHeight = isMobile ? 400 : isTablet ? 450 : 500;

  useEffect(() => {
    frameImageRef.current = null;
  }, [selectedFrame]);

   const switchCamera = async () => {
 
    try {
      // --- 1️⃣ Visual feedback overlay ---
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '20px';
      overlay.style.left = '50%';
      overlay.style.transform = 'translateX(-50%)';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
      overlay.style.color = '#fff';
      overlay.style.padding = '10px 16px';
      overlay.style.borderRadius = '8px';
      overlay.style.zIndex = '9999';
      overlay.style.fontFamily = 'monospace';
      overlay.style.fontSize = '14px';
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 2000);
 
      // --- 2️⃣ Simulated log (desktop feedback only) ---
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (!isMobileDevice) {
        console.log('🖥️ Simulated flip — desktop detected (no real camera switch).');
      }
 
      // --- 3️⃣ Stop current stream ---
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
 
      // --- 4️⃣ Toggle camera state ---
      const newCamera = currentCamera === 'user' ? 'environment' : 'user';
      setCurrentCamera(newCamera);
      // --- 5️⃣ (Optional) Restart stream for real devices ---
      if (isMobileDevice) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: newCamera },
          audio: mode === 'video',
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log(`✅ Switched to ${newCamera} camera successfully.`);
        }
      } else {
        console.log('⚙️ Skipped getUserMedia — desktop test mode.');
      }
 
    } catch (err) {
      console.error('❌ Error switching camera:', err);
    }
  };

  // Check for supported MIME types
  const getSupportedMimeType = () => {
    const types = [
      'video/webm; codecs=vp9',
      'video/webm; codecs=vp8',
      'video/webm; codecs=h264',
      'video/mp4; codecs=h264',
      'video/webm',
      'video/mp4'
    ];

    // Use array iteration instead of for loop
    const supportedType = types.find((type) => MediaRecorder.isTypeSupported(type));
    return supportedType || 'video/webm';
  };

  // Draw frame on canvas for video recording
  const drawFrameOnCanvas = useCallback(() => {
    const video = videoRef.current;
    const canvas = videoCanvasRef.current;

    if (!canvas || !video || video.readyState < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw frame overlay if selected - FIXED: Only create image once
    if (selectedFrame) {
      // Create frame image only once and reuse it
      if (!frameImageRef.current) {
        frameImageRef.current = new Image();
        frameImageRef.current.crossOrigin = 'anonymous';
        frameImageRef.current.src = selectedFrame;
      }

      // Only draw if the image is loaded
      if (frameImageRef.current.complete && frameImageRef.current.naturalHeight !== 0) {
        ctx.drawImage(frameImageRef.current, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [selectedFrame]);

  useEffect(() => {
    const localVideoRef = videoRef.current;
    let animationFrameId: number;

    const initializeCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: currentCamera,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: mode === 'video',
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (localVideoRef) {
          localVideoRef.srcObject = stream;

          // Wait for video to be ready
          localVideoRef.onloadedmetadata = () => {
            if (videoCanvasRef.current) {
              videoCanvasRef.current.width = localVideoRef.videoWidth;
              videoCanvasRef.current.height = localVideoRef.videoHeight;
            }

            // Start drawing loop for video recording
            if (mode === 'video') {
              const drawLoop = () => {
                drawFrameOnCanvas();
                animationFrameId = requestAnimationFrame(drawLoop);
              };
              drawLoop();
            }
          };
        }

        // Setup media recorder for video mode
        if (mode === 'video' && videoCanvasRef.current) {
          const canvas = videoCanvasRef.current;

          // Wait a bit for canvas to be ready
          setTimeout(() => {
            const canvasStream = canvas.captureStream(30);
            const audioTracks = stream.getAudioTracks();

            // Add audio tracks to canvas stream
            if (audioTracks.length > 0) {
              audioTracks.forEach(track => {
                canvasStream.addTrack(track);
              });
            }

            const mimeType = getSupportedMimeType();
            const recorder = new MediaRecorder(canvasStream, {
              mimeType,
              videoBitsPerSecond: 2500000
            });

            const chunks: Blob[] = [];
            recorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                chunks.push(event.data);
              }
            };

            recorder.onstop = () => {
              const blob = new Blob(chunks, {
                type: mimeType.includes('mp4') ? 'video/mp4' : 'video/webm'
              });
              const url = URL.createObjectURL(blob);
              setRecordedVideoURL(url);
              setIsRecording(false);
            };

            recorder.onstart = () => {
              setIsRecording(true);
            };

            setMediaRecorder(recorder);
          }, 1000);
        }

      } catch (err) {
        console.error('Camera access error:', err);
      }
    };

    initializeCamera();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (localVideoRef && localVideoRef.srcObject) {
        const stream = localVideoRef.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode, cameraRestartTrigger, currentCamera, selectedFrame, drawFrameOnCanvas]);

  // Handle video playback controls
  const handlePlayPause = () => {
    if (previewVideoRef.current) {
      if (previewVideoRef.current.paused) {
        previewVideoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        previewVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw frame overlay if selected - SIMPLER APPROACH
        const captureWithFrame = () => {
          if (selectedFrame) {
            const frameImg = new Image();
            frameImg.crossOrigin = 'anonymous';
            frameImg.onload = () => {
              context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
              const imageData = canvas.toDataURL('image/png');
              setCapturedPhoto(imageData);
              setShowFilterEdit(true);
            };
            frameImg.src = selectedFrame;
          } else {
            const imageData = canvas.toDataURL('image/png');
            setCapturedPhoto(imageData);
            setShowFilterEdit(true);
          }
        };

        // Small delay to ensure the video frame is properly drawn
        setTimeout(captureWithFrame, 100);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - startDrag.x;
      const dy = e.clientY - startDrag.y;
      setStartDrag({ x: e.clientX, y: e.clientY });
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e: React.WheelEvent) => {
    const delta = -e.deltaY;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta * 0.001)));
  };

  const handleRetake = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCapturedPhoto(null);
    setShowFilterEdit(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedFilter('none');
    setRecordedVideoURL(null);
    setRecordedChunks([]);
    setIsRecording(false);
    setIsVideoPlaying(false);
    setCameraRestartTrigger(prev => prev + 1);
  };

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'recording') {
      setRecordedChunks([]);
      mediaRecorder.start(1000); // Collect data every second
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  const getVideoExtension = () => {
    if (!recordedVideoURL) return 'webm';
    return recordedVideoURL.includes('mp4') ? 'mp4' : 'webm';
  };

  return (
    <Container maxWidth={false} sx={{ px: { xs: 0, sm: 0 } }}>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: 0,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          p: { xs: 2, sm: 3 },
          minHeight: 500,
        }}
      >
        <HeadingCommon title={title} weight={600} baseSize="20px" />

        {/* ---- CAMERA VIEW ---- */}
        <Box sx={{ textAlign: 'center', mb: 2, position: 'relative' }}>
          <Box
            sx={{
              position: 'relative',
              width: previewWidth,
              height: previewHeight,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Video / Photo */}
            {capturedPhoto ? (
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${capturedPhoto})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: selectedFilter !== 'none' ? `${selectedFilter}(1)` : 'none',
                }}
              />
            ) : recordedVideoURL ? (
              // === VIDEO PREVIEW MODE ===
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <video
                  ref={previewVideoRef}
                  src={recordedVideoURL}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onEnded={handleVideoEnd}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                >
                  <track kind="captions" srcLang="en" label="English captions" />
                </video>

                {/* Video Playback Controls Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    zIndex: 10,
                  }}
                >
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backdropFilter: 'blur(6px)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      },
                    }}
                  >
                    {isVideoPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Box>

                {/* Video Progress Bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    zIndex: 10,
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      backgroundColor: '#0B2E4C',
                      width: previewVideoRef.current
                        ? `${(previewVideoRef.current.currentTime / previewVideoRef.current.duration) * 100}%`
                        : '0%',
                      transition: 'width 0.1s linear',
                    }}
                  />
                </Box>
              </Box>
            ) : (
              // === LIVE CAMERA VIEW ===
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={mode === 'video'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <track kind="captions" srcLang="en" label="English captions" />
              </video>
            )}

            {/* Frame Overlay */}
            {selectedFrame && !capturedPhoto && !recordedVideoURL && (
              <Box
                component="img"
                src={selectedFrame}
                alt="Frame"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,

                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite',
                  }}
                />
                REC
              </Box>
            )}

            {/* TOP CAMERA CONTROLS */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                zIndex: 5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: '24px',
                  px: 2,
                  py: 0.5,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <IconButton
                  onClick={() => {
                    setMode('photo');
                    setCapturedPhoto(null);
                    setShowFilterEdit(false);
                    setRecordedVideoURL(null);
                    setIsVideoPlaying(false);
                  }}
                  sx={{
                    color: mode === 'photo' ? '#fff' : 'rgba(255,255,255,0.6)',
                    backgroundColor: mode === 'photo' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: '0.3s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <CameraAlt />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setMode('video');
                    setCapturedPhoto(null);
                    setShowFilterEdit(false);
                    setRecordedVideoURL(null);
                    setIsVideoPlaying(false);
                  }}
                  sx={{
                    color: mode === 'video' ? '#fff' : 'rgba(255,255,255,0.6)',
                    backgroundColor: mode === 'video' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: '0.3s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Videocam />
                </IconButton>
              </Box>
            </Box>

            {/* Flip Camera */}
            <IconButton
              onClick={() => {
                console.log('🖱️ Flip icon clicked!');
                switchCamera();
              }}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0,0,0,0.4)',
                color: '#fff',
                borderRadius: '50%',
                width: 40,
                height: 40,
                zIndex: 9999,
                backdropFilter: 'blur(6px)',
                transition: '0.3s',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <FlipCameraIos />
            </IconButton>
          </Box>

          {/* Hidden canvases */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <canvas ref={videoCanvasRef} style={{ display: 'none' }} />
        </Box>

        {/* ---- BOTTOM ACTION BUTTONS (Icon Only) ---- */}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {mode === 'photo' && !capturedPhoto ? (
            // === Photo Mode - Ready to Capture ===
            <Grid item>
              <IconButton
                onClick={handleCapture}
                sx={{
                  backgroundColor: '#0B2E4C',
                  color: '#fff',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: '#0a2742',
                  },
                }}
              >
                <CameraAlt sx={{ fontSize: 30 }} />
              </IconButton>
            </Grid>
          ) : mode === 'photo' && capturedPhoto ? (
            // === Photo Mode - After Capture ===
            <>
              <Grid item>
                <IconButton
                  onClick={() => {
                    if (!capturedPhoto) return;
                    const link = document.createElement('a');
                    link.href = capturedPhoto;
                    link.download = 'captured-photo.png';
                    link.click();
                  }}
                  sx={{
                    backgroundColor: '#0B2E4C',
                    color: '#fff',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: '#0a2742',
                    },
                  }}
                >
                  <Download sx={{ fontSize: 30 }} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={handleRetake}
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#0B2E4C',
                    border: '2px solid #0B2E4C',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: 'rgba(11, 46, 76, 0.1)',
                    },
                  }}
                >
                  <Replay sx={{ fontSize: 30 }} />
                </IconButton>
              </Grid>
            </>
          ) : mode === 'video' ? (
            // === Video Mode ===
            <>
              {!recordedVideoURL ? (
                // === Video Mode - Ready to Record ===
                <>
                  <Grid item>
                    <IconButton
                      onClick={startRecording}
                      disabled={!mediaRecorder || isRecording}
                      sx={{
                        backgroundColor: isRecording ? '#d32f2f' : '#d32f2f',
                        color: '#fff',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: isRecording ? '#c62828' : '#c62828',
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(211, 47, 47, 0.5)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    >
                      <FiberManualRecord sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={stopRecording}
                      disabled={!mediaRecorder || !isRecording}
                      sx={{
                        backgroundColor: 'transparent',
                        color: '#d32f2f',
                        border: '2px solid #d32f2f',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(211, 47, 47, 0.5)',
                          color: 'rgba(211, 47, 47, 0.5)',
                        }
                      }}
                    >
                      <Stop sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Grid>
                </>
              ) : (
                // === Video Mode - After Recording (Preview Mode) ===
                <>
                  <Grid item>
                    <IconButton
                      onClick={handlePlayPause}
                      sx={{
                        backgroundColor: '#0B2E4C',
                        color: '#fff',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: '#0a2742',
                        },
                      }}
                    >
                      {isVideoPlaying ? <Pause sx={{ fontSize: 30 }} /> : <PlayArrow sx={{ fontSize: 30 }} />}
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        if (recordedVideoURL) {
                          const extension = getVideoExtension();
                          const link = document.createElement('a');
                          link.href = recordedVideoURL;
                          link.download = `recorded-video.${extension}`;
                          link.click();
                        }
                      }}
                      sx={{
                        backgroundColor: '#0B2E4C',
                        color: '#fff',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: '#0a2742',
                        },
                      }}
                    >
                      <Download sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={handleRetake}
                      sx={{
                        backgroundColor: 'transparent',
                        color: '#0B2E4C',
                        border: '2px solid #0B2E4C',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: 'rgba(11, 46, 76, 0.1)',
                        },
                      }}
                    >
                      <Replay sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Grid>
                </>
              )}
            </>
          ) : null}
        </Grid>
      </Box>
    </Container>
  );
};