import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const categories = {
  expense: ['Food', 'Rent', 'Utilities', 'Transport', 'Healthcare', 'Education', 'Entertainment', 'Shopping', 'Travel', 'Other'],
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Other']
};

const TransactionForm = ({ onSubmit, transaction, mode = 'add', onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date(),
    description: ''
  });

  // If editing, populate form with transaction data
  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        type: transaction.type || 'expense',
        category: transaction.category || '',
        amount: transaction.amount || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        description: transaction.description || ''
      });
    }
  }, [transaction, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Transaction Type */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
              >
                <FormControlLabel 
                  value="expense" 
                  control={<Radio />} 
                  label="Expense" 
                />
                <FormControlLabel 
                  value="income" 
                  control={<Radio />} 
                  label="Income" 
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                {categories[formData.type].map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="amount"
              label="Amount"
              name="amount"
              type="number"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              value={formData.amount}
              onChange={handleChange}
            />
          </Grid>
          
          {/* Date */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          
          {/* Buttons */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            {onCancel && (
              <Button onClick={onCancel} variant="outlined">
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!formData.category || !formData.amount}
            >
              {mode === 'add' ? 'Add Transaction' : 'Update Transaction'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TransactionForm; 