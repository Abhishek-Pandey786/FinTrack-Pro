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
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon,
  FileDownload as DownloadIcon,
  ListAlt as ListIcon,
  PictureAsPdf as PdfIcon,
  FileOpen as ExcelIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const Transactions = () => {
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
  const [tabValue, setTabValue] = useState(0);
  
  // Filter transactions based on tab
  const filteredTransactions = tabValue === 0 
    ? transactions 
    : tabValue === 1 
      ? transactions.filter(t => t.type === 'income')
      : transactions.filter(t => t.type === 'expense');

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
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleExportToPDF = () => {
    exportToPDF(filteredTransactions, 
      tabValue === 0 ? 'All Transactions' : 
      tabValue === 1 ? 'Income Only' : 'Expenses Only'
    );
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredTransactions);
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
            <ListIcon sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h5" component="h1" fontWeight="500">
              Transactions Management
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            View, filter, and manage all your income and expense transactions.
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          {/* Transaction Form */}
          {showForm && (
            <Box sx={{ mb: 4 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
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
          
          {/* Transactions */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="h2" fontWeight="500">
                  {tabValue === 0 ? 'All Transactions' : tabValue === 1 ? 'Income Transactions' : 'Expense Transactions'}
                </Typography>
                <Tooltip title="Filter transactions by type">
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
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ 
                mb: 2,
                '& .MuiTab-root': {
                  minWidth: 100,
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }
              }}
            >
              <Tab label="All" />
              <Tab label="Income" />
              <Tab label="Expenses" />
            </Tabs>
            
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : filteredTransactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No transactions found. Add a new transaction to get started.
                </Typography>
              </Box>
            ) : (
              <TransactionList 
                transactions={filteredTransactions} 
                onEdit={handleEditClick} 
                onDelete={deleteTransaction}
              />
            )}
          </Paper>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Transactions; 