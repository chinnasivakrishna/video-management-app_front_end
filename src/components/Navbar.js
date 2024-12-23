import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  margin: theme.spacing(0, 1),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 600,
  letterSpacing: 1,
  background: 'linear-gradient(45deg, #FFFFFF 30%, #E3F2FD 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginLeft: theme.spacing(1),
}));

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Menu items array
  const menuItems = isAuthenticated ? [
    <MenuItem key="videos" component={Link} to="/" onClick={handleCloseNavMenu}>
      <Typography textAlign="center">My Videos</Typography>
    </MenuItem>,
    <MenuItem key="upload" component={Link} to="/upload" onClick={handleCloseNavMenu}>
      <Typography textAlign="center">Upload</Typography>
    </MenuItem>,
    <MenuItem key="logout" onClick={() => { handleLogout(); handleCloseNavMenu(); }}>
      <Typography textAlign="center">Logout</Typography>
    </MenuItem>
  ] : [];

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <VideoLibraryIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <LogoText
            variant="h6"
            noWrap
            component={Link}
            to={isAuthenticated ? "/" : "/login"}
            sx={{
              display: { xs: 'none', md: 'flex' },
              textDecoration: 'none',
            }}
          >
            VIDEO MANAGER
          </LogoText>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {isAuthenticated && (
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {menuItems}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <VideoLibraryIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <LogoText
            variant="h6"
            noWrap
            component={Link}
            to={isAuthenticated ? "/" : "/login"}
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              textDecoration: 'none',
            }}
          >
            VIDEO MANAGER
          </LogoText>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {isAuthenticated && (
              <>
                <StyledButton component={Link} to="/" onClick={handleCloseNavMenu}>
                  My Videos
                </StyledButton>
                <StyledButton component={Link} to="/upload" onClick={handleCloseNavMenu}>
                  Upload
                </StyledButton>
                <StyledButton onClick={handleLogout}>
                  Logout
                </StyledButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
