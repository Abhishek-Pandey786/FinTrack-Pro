import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Button,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListIcon,
  ShowChart as ChartIcon,
  Info as InfoIcon,
  PictureAsPdf as PdfIcon,
  FileOpen as ExcelIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import DashboardSummary from '../components/DashboardSummary';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { getCurrentMonthTransactions } from '../utils/analyticsUtils';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const Dashboard = () => {
  const { 
    transactions, 
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  const theme = useTheme();
  
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [formMode, setFormMode] = useState('add');
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Get current month transactions
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);

  const handleAddClick = () => {
    setEditTransaction(null);
    setFormMode('add');
    setShowForm(true);
  };
  
  const handleFormSubmit = async (data) => {
    try {
      if (formMode === 'add') {
        await addTransaction(data);
      } else {
        await updateTransaction(editTransaction.id, data);
      }
      setShowForm(false);
      setEditTransaction(null);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };
  
  const handleEditClick = (transaction) => {
    setEditTransaction(transaction);
    setFormMode('edit');
    setShowForm(true);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditTransaction(null);
  };

  const handleExportToPDF = () => {
    exportToPDF(recentTransactions, 'Recent Transactions');
  };

  const handleExportToExcel = () => {
    exportToExcel(recentTransactions);
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
            <DashboardIcon sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h5" component="h1" fontWeight="500">
              Dashboard Overview
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Monitor your financial health and manage your recent transactions.
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          {/* Financial Summary */}
          <DashboardSummary />
          
          {/* Transaction Form */}
          {showForm && (
            <Box sx={{ mt: 4 }}>
              <TransactionForm 
                onSubmit={handleFormSubmit} 
                transaction={editTransaction}
                mode={formMode}
                onCancel={handleCancelForm}
              />
            </Box>
          )}
          
          {/* Add Transaction Button */}
          {!showForm && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{ 
                  px: 3, 
                  py: 1,
                  fontWeight: 'medium',
                  borderRadius: 2
                }}
              >
                Add Transaction
              </Button>
            </Box>
          )}
          
          {/* Recent Transactions */}
          <Box sx={{ mt: 2, mb: 4 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" component="h2" fontWeight="500">
                    Recent Transactions
                  </Typography>
                  <Tooltip title="Shows your 5 most recent transactions">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box>
                  <Tooltip title="Export to PDF">
                    <IconButton onClick={handleExportToPDF} sx={{ color: 'error.main' }}>
                      <PdfIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export to Excel">
                    <IconButton onClick={handleExportToExcel} sx={{ color: 'success.main' }}>
                      <ExcelIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : recentTransactions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    No recent transactions. Add your first transaction to get started.
                  </Typography>
                </Box>
              ) : (
                <TransactionList 
                  transactions={recentTransactions} 
                  onEdit={handleEditClick} 
                  onDelete={deleteTransaction}
                />
              )}
            </Paper>
          </Box>
          
          {/* This Month's Summary */}
          <Box>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChartIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="h2" fontWeight="500">
                  This Month's Summary
                </Typography>
                <Tooltip title="Financial summary for the current month">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          borderLeft: '4px solid', 
                          borderColor: 'success.main',
                          height: '100%'
                        }}
                      >
                        <Typography variant="subtitle1" component="div" fontWeight="500">
                          Total Income:
                        </Typography>
                        <Typography variant="h6" component="div" color="success.main" fontWeight="bold">
                          ₹{currentMonthTransactions
                            .filter(t => t.type === 'income')
                            .reduce((sum, t) => sum + Number(t.amount), 0)
                            .toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          borderLeft: '4px solid', 
                          borderColor: 'error.main',
                          height: '100%' 
                        }}
                      >
                        <Typography variant="subtitle1" component="div" fontWeight="500">
                          Total Expense:
                        </Typography>
                        <Typography variant="h6" component="div" color="error.main" fontWeight="bold">
                          ₹{currentMonthTransactions
                            .filter(t => t.type === 'expense')
                            .reduce((sum, t) => sum + Number(t.amount), 0)
                            .toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          borderLeft: '4px solid', 
                          borderColor: 'primary.main',
                          height: '100%' 
                        }}
                      >
                        <Typography variant="subtitle1" component="div" fontWeight="500">
                          Net Savings:
                        </Typography>
                        <Typography variant="h6" component="div" color="primary.main" fontWeight="bold">
                          ₹{(
                            currentMonthTransactions
                              .filter(t => t.type === 'income')
                              .reduce((sum, t) => sum + Number(t.amount), 0) -
                            currentMonthTransactions
                              .filter(t => t.type === 'expense')
                              .reduce((sum, t) => sum + Number(t.amount), 0)
                          ).toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;