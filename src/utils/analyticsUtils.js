// Get transactions for the current month
export const getCurrentMonthTransactions = (transactions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth && 
      transactionDate.getFullYear() === currentYear
    );
  });
};

// Group transactions by category
export const groupByCategory = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {});
};

// Calculate category totals
export const calculateCategoryTotals = (groupedTransactions) => {
  const categoryTotals = {};
  
  Object.keys(groupedTransactions).forEach(category => {
    categoryTotals[category] = groupedTransactions[category].reduce(
      (total, transaction) => total + Number(transaction.amount), 
      0
    );
  });
  
  return categoryTotals;
};

// Format data for pie chart
export const getPieChartData = (transactions, type = 'expense') => {
  const filteredTransactions = transactions.filter(t => t.type === type);
  const groupedByCategory = groupByCategory(filteredTransactions);
  const categoryTotals = calculateCategoryTotals(groupedByCategory);
  
  // Prepare colors for the chart
  const backgroundColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC249', '#EA7E53', '#F06292', '#7986CB'
  ];
  
  const labels = Object.keys(categoryTotals);
  
  return {
    labels,
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: backgroundColors.slice(0, labels.length),
      hoverBackgroundColor: backgroundColors.slice(0, labels.length)
    }]
  };
};

// Get monthly totals for bar chart
export const getMonthlyData = (transactions, year = new Date().getFullYear()) => {
  // Filter transactions for the selected year
  const yearTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year;
  });
  
  // Initialize monthly data
  const monthlyIncomes = Array(12).fill(0);
  const monthlyExpenses = Array(12).fill(0);
  
  // Calculate monthly totals
  yearTransactions.forEach(transaction => {
    const month = new Date(transaction.date).getMonth();
    const amount = Number(transaction.amount);
    
    if (transaction.type === 'income') {
      monthlyIncomes[month] += amount;
    } else {
      monthlyExpenses[month] += amount;
    }
  });
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return {
    labels: months,
    datasets: [
      {
        label: 'Income',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        data: monthlyIncomes
      },
      {
        label: 'Expense',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        data: monthlyExpenses
      }
    ]
  };
}; 