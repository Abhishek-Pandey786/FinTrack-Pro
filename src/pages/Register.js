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
  useTheme,
  useMediaQuery,
  Grid,
  Divider,
  Fade,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
  Email,
  Lock,
  TrendingUp,
  CheckCircleOutline
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please try another email or login.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return { 
      strength, 
      label: strength > 0 ? labels[strength - 1] : 'Too weak',
      color: ['error.main', 'warning.main', 'success.light', 'success.main'][strength - 1]
    };
  };
  
  const passwordStrength = getPasswordStrength();

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
                    Start Your Financial Journey!
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.9 }}>
                    Join thousands of users who are taking control of their finances with our powerful expense tracking and analytics tools.
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={1} orientation="vertical" sx={{ '& .MuiStepLabel-label': { color: 'white' } }}>
                      <Step>
                        <StepLabel>
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            Create your account
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            Track your expenses
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            Analyze your spending habits
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            Achieve financial freedom
                          </Typography>
                        </StepLabel>
                      </Step>
                    </Stepper>
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
                  <RegisterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Create your account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Fill in your details to get started with FinTrack
                  </Typography>
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
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
                    sx={{ mb: 2.5 }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  
                  {password && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" color={passwordStrength.color || 'text.secondary'}>
                          Password Strength: {passwordStrength.label}
                        </Typography>
                        {passwordStrength.strength >= 3 && (
                          <CheckCircleOutline color="success" fontSize="small" />
                        )}
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 4, 
                        bgcolor: 'grey.200', 
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${(passwordStrength.strength / 4) * 100}%`, 
                          height: '100%',
                          bgcolor: passwordStrength.color || 'grey.300',
                          transition: 'width 0.3s ease-in-out'
                        }}/>
                      </Box>
                    </Box>
                  )}
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    error={confirmPassword && password !== confirmPassword}
                    helperText={confirmPassword && password !== confirmPassword ? "Passwords don't match" : ""}
                  />
                  
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
                    startIcon={<RegisterIcon />}
                  >
                    Create Account
                  </Button>
                  
                  <Divider sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" display="inline">
                      Already have an account?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" display="inline" sx={{ mx: 1 }}>
                      •
                    </Typography>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary" display="inline" fontWeight="bold">
                        Sign In
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

export default Register; 