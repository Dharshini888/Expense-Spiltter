import React from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const categoryMap = {
      'Food': { icon: '🍔', color: '#f59e0b' },
      'Travel': { icon: '🚕', color: '#10b981' },
      'Rent': { icon: '🏠', color: '#ef4444' },
      'Groceries': { icon: '🛒', color: '#3b82f6' },
      'Entertainment': { icon: '🎉', color: '#8b5cf6' },
      'Other': { icon: '📦', color: '#6b7280' }
};

function ExpenseList({ expenses }) {
      return (
            <Box sx={{ mt: 4 }} data-testid="expense-list">
                  <Typography variant="h5" sx={{ mb: 4, fontWeight: 800 }} className="text-gradient">Expense History</Typography>
                  {expenses.length === 0 ? (
                        <Paper className="glass-effect" sx={{ p: 6, textAlign: 'center', borderRadius: 1 }}>
                              <Typography variant="h6" color="text.secondary" data-testid="no-expenses" sx={{ fontWeight: 500 }}>No expenses recorded yet.</Typography>
                              <Typography variant="body2" color="text.secondary">Start by adding your first transaction above.</Typography>
                        </Paper>
                  ) : (
                        <Stack spacing={2} data-testid="expenses-list">
                              {expenses.map((expense) => {
                                    const cat = categoryMap[expense.category] || categoryMap['Other'];
                                    return (
                                          <Paper
                                                key={expense.expenseId}
                                                className="glass-effect"
                                                sx={{
                                                      p: 3,
                                                      display: 'flex',
                                                      flexDirection: { xs: 'column', sm: 'row' },
                                                      alignItems: 'center',
                                                      borderRadius: 1,
                                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                      '&:hover': {
                                                            transform: 'translateX(8px)',
                                                            borderColor: 'primary.main',
                                                      }
                                                }}
                                                data-testid={`expense-item-${expense.expenseId}`}
                                          >
                                                <Box
                                                      sx={{
                                                            width: 60,
                                                            height: 60,
                                                            borderRadius: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '2rem',
                                                            mr: { sm: 3 },
                                                            mb: { xs: 2, sm: 0 },
                                                            backgroundColor: `${cat.color}15`,
                                                            color: cat.color,
                                                            border: `1px solid ${cat.color}30`
                                                      }}
                                                >
                                                      {cat.icon}
                                                </Box>
                                                <Box sx={{ flexGrow: 1, width: '100%' }}>
                                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                                            <Box>
                                                                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>{expense.description}</Typography>
                                                                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                                        Paid by <span style={{ color: '#6366f1', fontWeight: 700 }}>{expense.payer}</span> • {format(new Date(expense.date), 'MMM dd, yyyy')}
                                                                  </Typography>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'end', ml: 'auto' }}>
                                                                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }} className="text-gradient">₹{expense.amount.toFixed(2)}</Typography>
                                                                  <Box
                                                                        sx={{
                                                                              display: 'inline-block',
                                                                              px: 1.5,
                                                                              py: 0.5,
                                                                              borderRadius: 0.5,
                                                                              bgcolor: 'action.hover',
                                                                              color: 'text.secondary',
                                                                              fontSize: '0.7rem',
                                                                              fontWeight: 700,
                                                                              textTransform: 'uppercase',
                                                                              letterSpacing: '1px'
                                                                        }}
                                                                  >
                                                                        {expense.category || 'Other'}
                                                                  </Box>
                                                            </Box>
                                                      </Box>
                                                      <Stack spacing={1} sx={{ mt: 1 }}>
                                                            {expense.dueDate && (
                                                                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: new Date(expense.dueDate) < new Date() ? '#ef4444' : 'text.secondary', fontWeight: 700 }}>
                                                                        <span style={{ marginRight: '4px' }}>📅</span> {new Date(expense.dueDate) < new Date() ? 'OVERDUE' : 'DUE'} {format(new Date(expense.dueDate), 'MMM dd').toUpperCase()}
                                                                  </Typography>
                                                            )}
                                                            {expense.attachmentUrl && (
                                                                  <Box
                                                                        component="a"
                                                                        href={expense.attachmentUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        sx={{
                                                                              display: 'flex',
                                                                              alignItems: 'center',
                                                                              gap: 0.5,
                                                                              color: 'primary.main',
                                                                              textDecoration: 'none',
                                                                              fontSize: '0.75rem',
                                                                              fontWeight: 600,
                                                                              '&:hover': { textDecoration: 'underline' }
                                                                        }}
                                                                  >
                                                                        <span>📎</span> View Attachment
                                                                  </Box>
                                                            )}
                                                      </Stack>
                                                </Box>
                                          </Paper>
                                    );
                              })}
                        </Stack>
                  )}
            </Box>
      );
}

ExpenseList.propTypes = {
      expenses: PropTypes.arrayOf(
            PropTypes.shape({
                  expenseId: PropTypes.number.isRequired,
                  description: PropTypes.string.isRequired,
                  amount: PropTypes.number.isRequired,
                  payer: PropTypes.string.isRequired,
                  date: PropTypes.string.isRequired,
                  category: PropTypes.string,
                  dueDate: PropTypes.string
            })
      ).isRequired
};

export default ExpenseList;