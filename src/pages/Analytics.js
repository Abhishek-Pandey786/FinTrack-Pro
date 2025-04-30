import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  useTheme
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  DateRange as DateRangeIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import { 
  PieChartComponent, 
  BarChartComponent, 
  NoDataDisplay 
} from '../components/ChartComponents';
import { 
  getPieChartData, 
  getMonthlyData,
  getCurrentMonthTransactions
} from '../utils/analyticsUtils';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const Analytics = () => {
  const { transactions, loading } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const theme = useTheme();
  
  // Current month transactions
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  
  // Get expense data for pie chart
  const expensePieData = getPieChartData(currentMonthTransactions, 'expense');
  
  // Get income data for pie chart
  const incomePieData = getPieChartData(currentMonthTransactions, 'income');
  
  // Get monthly data for bar chart
  const monthlyData = getMonthlyData(transactions, selectedYear);
  
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  
  // Check if data is available for charts
  const hasExpenseData = expensePieData.labels.length > 0;
  const hasIncomeData = incomePieData.labels.length > 0;
  const hasMonthlyData = monthlyData.datasets[0].data.some(value => value > 0) || 
                        monthlyData.datasets[1].data.some(value => value > 0);

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
            <BarChartIcon sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h5" component="h1" fontWeight="500">
              Financial Analytics
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Visualize your income and expenses to gain insights into your financial patterns.
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : transactions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5, px: 3 }}>
              <Typography color="text.secondary" variant="h6" gutterBottom>
                No transaction data available
              </Typography>
              <Typography color="text.secondary">
                Add some transactions to see analytics and insights about your finances.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={0}>
                {/* Monthly Expense Breakdown */}
                <Grid item xs={12} md={6} sx={{ p: 3, borderRight: { md: `1px solid ${theme.palette.divider}` }, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChartIcon sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="h6" component="h3" fontWeight="500">
                      Monthly Expense Breakdown
                    </Typography>
                    <Tooltip title="Shows your expenses categorized for the current month">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {hasExpenseData ? (
                    <PieChartComponent 
                      data={expensePieData} 
                      title="Expenses by Category" 
                    />
                  ) : (
                    <NoDataDisplay message="No expense data available for the current month." />
                  )}
                </Grid>
                
                {/* Monthly Income Breakdown */}
                <Grid item xs={12} md={6} sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChartIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6" component="h3" fontWeight="500">
                      Monthly Income Breakdown
                    </Typography>
                    <Tooltip title="Shows your income sources categorized for the current month">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {hasIncomeData ? (
                    <PieChartComponent 
                      data={incomePieData} 
                      title="Income by Category" 
                    />
                  ) : (
                    <NoDataDisplay message="No income data available for the current month." />
                  )}
                </Grid>
                
                {/* Monthly Income vs Expense Chart */}
                <Grid item xs={12} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BarChartIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" component="h3" fontWeight="500">
                        Monthly Income vs Expenses ({selectedYear})
                      </Typography>
                      <Tooltip title="Compare your monthly income and expenses across the year">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {/* Year Selection */}
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                      <InputLabel id="year-select-label">Year</InputLabel>
                      <Select
                        labelId="year-select-label"
                        id="year-select"
                        value={selectedYear}
                        onChange={handleYearChange}
                        label="Year"
                        startAdornment={<DateRangeIcon sx={{ ml: 1, mr: 0.5, color: 'primary.main' }} />}
                      >
                        {years.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {hasMonthlyData ? (
                    <BarChartComponent 
                      data={monthlyData} 
                      title="Income vs. Expenses" 
                    />
                  ) : (
                    <NoDataDisplay message={`No transaction data available for ${selectedYear}.`} />
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Analytics; 