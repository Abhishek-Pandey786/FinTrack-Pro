import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
  AccountBalance as BalanceIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const DashboardSummary = () => {
  const { 
    transactions, 
    calculateTotalIncome, 
    calculateTotalExpense, 
    getBalance 
  } = useTransactions();

  const totalIncome = calculateTotalIncome();
  const totalExpense = calculateTotalExpense();
  const balance = getBalance();

  const handleExportToPDF = () => {
    exportToPDF(transactions);
  };

  const handleExportToExcel = () => {
    exportToExcel(transactions);
  };

  const SummaryCard = ({ title, value, icon, color }) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ 
          backgroundColor: `${color}.light`, 
          p: 1, 
          borderRadius: 1, 
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        ₹{value.toFixed(2)}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Financial Overview
        </Typography>
        <Box>
          <Tooltip title="Export to PDF">
            <IconButton onClick={handleExportToPDF}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton onClick={handleExportToExcel}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <SummaryCard 
            title="Total Income" 
            value={totalIncome} 
            icon={<IncomeIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard 
            title="Total Expense" 
            value={totalExpense} 
            icon={<ExpenseIcon sx={{ color: 'error.main' }} />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard 
            title="Balance" 
            value={balance} 
            icon={<BalanceIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSummary; 