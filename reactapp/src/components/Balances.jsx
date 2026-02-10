import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

export default function Balances({ balances }) {
    if (!balances || balances.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 1, bgcolor: 'action.hover', border: '1px dashed rgba(128,128,128,0.2)' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>No balances to display.</Typography>
            </Paper>
        );
    }

    return (
        <Grid container spacing={3} sx={{ mt: 1 }}>
            {balances.map((b, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper
                        className="glass-effect"
                        sx={{
                            p: 4,
                            borderRadius: 1,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'scale(1.02)', borderColor: b.balance >= 0 ? 'success.main' : 'error.main' }
                        }}
                    >
                        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '2px' }}>{b.memberName}</Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 900,
                                mt: 1,
                                color: b.balance >= 0 ? 'success.main' : 'error.main',
                                letterSpacing: '-1px'
                            }}
                        >
                            {b.balance >= 0 ? '+' : ''}₹{Math.abs(b.balance).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, mt: 1, textTransform: 'uppercase' }}>
                            {b.balance >= 0 ? 'is owed' : 'owes total'}
                        </Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}
