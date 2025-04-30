import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  Email,
  TrendingUp,
  LockReset
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      // Email validation
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      // Just send the reset email and let Firebase handle if the email exists
      await resetPassword(email);
      setMessage('If this email is registered, you will receive a password reset link shortly');
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else if (err.code === 'auth/user-not-found') {
        // Don't expose this information, instead show generic success message
        setMessage('If this email is registered, you will receive a password reset link shortly');
        setLoading(false);
        return;
      } else {
        setError('Failed to reset password. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
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
                  backgroundImage: 'url(https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop)',
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
                    Password Recovery
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.9 }}>
                    We'll help you reset your password and get back to managing your finances.
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Instructions:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                      <Typography component="li" variant="body2">
                        Enter your registered email address
                      </Typography>
                      <Typography component="li" variant="body2">
                        Check your inbox for a reset link
                      </Typography>
                      <Typography component="li" variant="body2">
                        Create a new secure password
                      </Typography>
                      <Typography component="li" variant="body2">
                        Log in with your new credentials
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
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.lighter',
                    mb: 3
                  }}>
                    <LockReset sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Reset Your Password
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450, mb: 1 }}>
                    Enter your registered email address and we'll send you instructions to reset your password
                  </Typography>
                </Box>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      '& .MuiAlert-icon': { 
                        alignItems: 'center' 
                      } 
                    }}
                  >
                    {error}
                  </Alert>
                )}
                
                {message && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      '& .MuiAlert-icon': { 
                        alignItems: 'center' 
                      } 
                    }}
                  >
                    {message}
                  </Alert>
                )}
                
                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  noValidate
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                        }
                      }
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      py: 1.5, 
                      mt: 1,
                      mb: 3,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.2)'
                      }
                    }}
                    disabled={loading}
                    startIcon={<SendIcon />}
                  >
                    Send Reset Link
                  </Button>
                  
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        sx={{ 
                          mr: 2,
                          borderRadius: 2,
                          px: 3,
                          textTransform: 'none' 
                        }}
                      >
                        Back to Login
                      </Button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Button 
                        variant="text" 
                        color="primary"
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          textTransform: 'none' 
                        }}
                      >
                        Create an Account
                      </Button>
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

export default ForgotPassword; 