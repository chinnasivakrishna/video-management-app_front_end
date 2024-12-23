import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CloudUpload,
  Add as AddIcon,
  Google as GoogleIcon,
  VideoFile,
  InsertDriveFile,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useDriveApi } from '../../hooks/useDriveApi';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
  },
}));

const VideoUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    file: null,
    driveUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDriveDialog, setShowDriveDialog] = useState(false);
  const [driveFiles, setDriveFiles] = useState([]);
  const [selectedDriveFile, setSelectedDriveFile] = useState(null);
  
  const { initClient, listFiles, getFileUrl } = useDriveApi();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('File size should not exceed 100MB');
        return;
      }
      setSelectedFile(file);
      setFormData({
        ...formData,
        file: file,
        driveUrl: '' // Clear drive URL when local file is selected
      });
      setError(''); // Clear any existing errors
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleGoogleDriveSelect = async () => {
    try {
      await initClient();
      const files = await listFiles();
      setDriveFiles(files);
      setShowDriveDialog(true);
    } catch (error) {
      setError('Failed to access Google Drive: ' + error.message);
    }
  };

  const handleDriveFileSelect = async (file) => {
    try {
      const fileUrl = await getFileUrl(file.id);
      setFormData({
        ...formData,
        driveUrl: fileUrl,
        file: null // Clear local file when Drive file is selected
      });
      setSelectedDriveFile(file);
      setShowDriveDialog(false);
      setError('');
    } catch (error) {
      setError('Failed to select file: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Form validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.file && !formData.driveUrl) {
        throw new Error('Please select a video file or provide a Drive URL');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      if (formData.file) {
        formDataToSend.append('video', formData.file);
      } else if (formData.driveUrl) {
        formDataToSend.append('driveUrl', formData.driveUrl);
      }

      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        navigate('/login');
        return;
      }

      const response = await fetch('https://video-management-app.onrender.com/api/videos/upload', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token, // Backup token header
        },
        credentials: 'include'
      });

      console.log('Upload response:', response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        if (response.status === 401) {
          Cookies.remove('token');
          localStorage.removeItem('token');
          navigate('/login');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(errorData.message || 'Upload failed');
      }

      setSuccess('Video uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        tags: [],
        file: null,
        driveUrl: ''
      });
      setSelectedFile(null);

      // Optionally redirect to videos list after successful upload
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={6}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upload Video
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Video Title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
            error={!formData.title && error}
            helperText={!formData.title && error ? 'Title is required' : ''}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!formData.description && error}
            helperText={!formData.description && error ? 'Description is required' : ''}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <IconButton onClick={handleAddTag} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <StyledButton
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
            >
              Upload File
              <VisuallyHiddenInput 
                type="file" 
                accept="video/*"
                onChange={handleFileChange}
              />
            </StyledButton>

            <StyledButton
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleDriveSelect}
            >
              Select from Drive
            </StyledButton>
          </Box>

          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}

          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || (!formData.file && !formData.driveUrl)}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Video'}
          </StyledButton>
        </Box>
      </StyledPaper>

      {/* Drive File Selection Dialog */}
      <Dialog 
        open={showDriveDialog} 
        onClose={() => setShowDriveDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Video from Google Drive</DialogTitle>
        <DialogContent>
          <List>
            {driveFiles.map((file) => (
              <ListItem
                button
                key={file.id}
                onClick={() => handleDriveFileSelect(file)}
              >
                <ListItemIcon>
                  {file.mimeType.includes('video') ? <VideoFile /> : <InsertDriveFile />}
                </ListItemIcon>
                <ListItemText 
                  primary={file.name}
                  secondary={`Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDriveDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideoUpload;
