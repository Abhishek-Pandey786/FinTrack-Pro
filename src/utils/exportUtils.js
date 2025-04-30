import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (transactions, period = 'All Time') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Expense Tracker Report', 14, 22);
  
  // Add period
  doc.setFontSize(12);
  doc.text(`Period: ${period}`, 14, 32);
  
  // Calculate summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const balance = totalIncome - totalExpense;
  
  // Add summary
  doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 14, 42);
  doc.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 14, 49);
  doc.text(`Balance: ₹${balance.toFixed(2)}`, 14, 56);
  
  // Prepare table data
  const tableColumn = ["Date", "Category", "Description", "Type", "Amount"];
  
  const tableRows = transactions.map(transaction => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.category,
    transaction.description,
    transaction.type,
    `₹${Number(transaction.amount).toFixed(2)}`
  ]);
  
  // Add table
  autoTable(doc, {
    startY: 65,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255
    }
  });
  
  // Save PDF
  doc.save('expense-tracker-report.pdf');
};

export const exportToExcel = (transactions) => {
  // Prepare data
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(item => ({
      Date: new Date(item.date).toLocaleDateString(),
      Category: item.category,
      Description: item.description,
      Type: item.type,
      Amount: `₹${Number(item.amount).toFixed(2)}`
    }))
  );
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Adjust column widths
  const columnWidths = [
    { wch: 12 }, // Date
    { wch: 15 }, // Category
    { wch: 30 }, // Description
    { wch: 10 }, // Type
    { wch: 10 }  // Amount
  ];
  worksheet['!cols'] = columnWidths;
  
  // Save Excel file
  XLSX.writeFile(workbook, 'expense-tracker-data.xlsx');
}; 