import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Cookies from 'js-cookie';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByTag, setFilterByTag] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);

  // Fetch videos from backend
  const fetchVideos = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/videos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data);

      // Extract unique tags from videos
      const tags = new Set();
      data.forEach(video => {
        video.tags.forEach(tag => tags.add(tag));
      });
      setAvailableTags(['all', ...Array.from(tags)]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter and sort videos
  const getFilteredAndSortedVideos = () => {
    return videos
      .filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            video.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = filterByTag === 'all' || video.tags.includes(filterByTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Videos
        </Typography>
        
        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Tag</InputLabel>
              <Select
                value={filterByTag}
                label="Filter by Tag"
                onChange={(e) => setFilterByTag(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                {availableTags.map(tag => (
                  <MenuItem key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Video Grid */}
        <Grid container spacing={3}>
          {getFilteredAndSortedVideos().map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video._id}>
              <Card 
                component={Link} 
                to={`/video/${video._id}`}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%', // 16:9 aspect ratio
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  }}
                  image={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {video.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {video.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Uploaded on {formatDate(video.createdAt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {getFilteredAndSortedVideos().length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No videos found
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default VideoList;
