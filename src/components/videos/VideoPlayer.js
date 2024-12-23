import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  FullscreenRounded,
  Forward10,
  Replay10,
  Settings,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { styled } from '@mui/material/styles';

const VideoContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#000',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  aspectRatio: '16/9',
  height: '100%',
  maxHeight: 'calc(100vh - 200px)', // Adjust based on your layout
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  transition: 'opacity 0.3s',
  opacity: 0,
  '&:hover': {
    opacity: 1,
  },
}));

const InfoContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  overflow: 'auto',
  maxHeight: 'calc(100vh - 200px)', // Match video height
}));

const TimeSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  '& .MuiSlider-thumb': {
    width: 8,
    height: 8,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}30`,
    },
    '&.Mui-active': {
      width: 12,
      height: 12,
    },
  },
}));

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }

        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (_, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (_, newValue) => {
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
      setMuted(newValue === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Left side - Video Player */}
        <Grid item xs={12} md={8}>
          <VideoContainer
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            elevation={3}
          >
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              src={`http://localhost:5000${videoData?.fileUrl}`}
              style={{ backgroundColor: '#000', objectFit: 'contain' }}
            />
            
            <VideoControls sx={{ opacity: showControls ? 1 : 0 }}>
              <TimeSlider
                value={currentTime}
                max={duration}
                onChange={handleSeek}
              />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <IconButton onClick={handlePlayPause} color="primary">
                  {playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={() => handleSkip(-10)} color="primary">
                  <Replay10 />
                </IconButton>
                <IconButton onClick={() => handleSkip(10)} color="primary">
                  <Forward10 />
                </IconButton>
                <Typography variant="body2" color="white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
                <Box sx={{ width: 100, ml: 'auto' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton onClick={handleMuteToggle} color="primary">
                      {muted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    <Slider
                      size="small"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                    />
                  </Stack>
                </Box>
                <IconButton onClick={handleFullscreen} color="primary">
                  <FullscreenRounded />
                </IconButton>
              </Stack>
            </VideoControls>
          </VideoContainer>
        </Grid>

        {/* Right side - Video Information */}
        <Grid item xs={12} md={4}>
          <InfoContainer elevation={3}>
            <Typography variant="h4" gutterBottom>
              {videoData?.title}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, fontSize: '0.9rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(videoData?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {videoData?.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ mb: 2 }}>
              {videoData?.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  sx={{ mr: 1, mb: 1 }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Additional metadata can be added here */}
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Video Details
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Duration: {formatTime(duration)}
              </Typography>
              {videoData?.fileSize && (
                <Typography variant="body2" color="text.secondary">
                  File Size: {Math.round(videoData.fileSize / (1024 * 1024))} MB
                </Typography>
              )}
            </Stack>
          </InfoContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoPlayer;
