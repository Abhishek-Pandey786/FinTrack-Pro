import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Button, 
  TextField,
  Grid,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, resetPassword } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const handleResetPassword = async () => {
    try {
      setError('');
      setMessage('');
      await resetPassword(currentUser.email);
      setPasswordResetSent(true);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email.');
    }
  };
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleConfirmReset = () => {
    handleResetPassword();
    handleCloseDialog();
  };

  // Get the first letter of email for avatar
  const getInitial = () => {
    return currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h5" component="h1" fontWeight="500">
              Profile Settings
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Manage your account information and security settings.
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
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
          
          {/* Account Information */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" component="h2" fontWeight="500">
                Account Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 3
                }}
              >
                {getInitial()}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="500">
                  {currentUser?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Account created on {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
            
            <TextField
              fullWidth
              label="Email Address"
              value={currentUser?.email || ''}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Paper>
          
          {/* Security Settings */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" component="h2" fontWeight="500">
                Security Settings
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="500">
                  Password
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Change your password to keep your account secure
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleOpenDialog}
                startIcon={<LockIcon />}
                sx={{ 
                  px: 3, 
                  py: 1,
                  fontWeight: 'medium',
                  borderRadius: 2
                }}
              >
                Change Password
              </Button>
            </Box>
            
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'primary.lighter', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <InfoIcon sx={{ color: 'primary.main', mr: 1, mt: 0.5 }} />
              <Typography variant="body2" color="textSecondary">
                Your password should be at least 8 characters long and include a mix of letters, numbers, and symbols for better security.
              </Typography>
            </Box>
          </Paper>
        </CardContent>
      </Card>
      
      {/* Password Reset Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 500 }}>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We will send a password reset link to your email address: <strong>{currentUser?.email}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmReset} 
            color="primary" 
            variant="contained"
            sx={{ 
              borderRadius: 1,
              px: 2
            }}
          >
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 