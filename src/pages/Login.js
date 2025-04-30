import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email,
  Lock,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 3
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'stretch' }}>
        <Fade in={true} timeout={800} sx={{ display: 'flex', flex: 1 }}>
          <Card elevation={5} sx={{ 
            overflow: 'hidden', 
            borderRadius: 4, 
            display: 'flex', 
            flexDirection: 'row',
            width: '100%'
          }}>
            {!isSmallScreen && (
              <Box
                sx={{ 
                  flex: '0 0 40%',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 4,
                  position: 'relative',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(25, 118, 210, 0.85)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUp sx={{ fontSize: 42, mr: 2 }} />
                    <Typography variant="h4" fontWeight="bold">
                      FinTrack Pro
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="500">
                    Welcome Back!
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.9 }}>
                    Log in to continue managing your expenses and gaining insights into your financial health.
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      With FinTrack Pro, you can:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                      <Typography component="li" variant="body2">
                        Track all your expenses in one place
                      </Typography>
                      <Typography component="li" variant="body2">
                        Visualize spending patterns with powerful charts
                      </Typography>
                      <Typography component="li" variant="body2">
                        Set and manage budgets for different categories
                      </Typography>
                      <Typography component="li" variant="body2">
                        Make better financial decisions with data-driven insights
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            <Box sx={{ flex: '1 1 auto' }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {isSmallScreen && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <TrendingUp sx={{ fontSize: 36, mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5" fontWeight="bold" color="primary.main">
                        FinTrack Pro
                      </Typography>
                    </Box>
                  )}
                  <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Sign in to your account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your credentials to continue
                  </Typography>
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="email" sx={{ display: 'block', mb: 1, ml: 1 }}>
                      Email Address *
                    </Typography>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      placeholder="Enter your email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="password" sx={{ display: 'block', mb: 1, ml: 1 }}>
                      Password *
                    </Typography>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      placeholder="Enter your password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        Forgot password?
                      </Typography>
                    </Link>
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      py: 1.5, 
                      mb: 3,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textTransform: 'none'
                    }}
                    disabled={loading}
                    startIcon={<LoginIcon />}
                  >
                    Sign In
                  </Button>
                  
                  <Divider sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" display="inline">
                      Don't have an account?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" display="inline" sx={{ mx: 1 }}>
                      •
                    </Typography>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary" display="inline" fontWeight="bold">
                        Sign Up
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Box>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login; 