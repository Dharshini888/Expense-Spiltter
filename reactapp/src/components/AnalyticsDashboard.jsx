import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../utils/api';

const COLORS = ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#ef4444', '#f59e0b'];

export default function AnalyticsDashboard({ groupId, expenses }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const result = await api.fetchCategoryAnalytics(groupId);
                setData(result);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };
        fetchAnalytics();
    }, [groupId, expenses]);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 800, letterSpacing: '1px' }} className="text-gradient">Group Analytics</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Spending Distribution by Category</Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="#7c3aed" />
                                        </linearGradient>
                                    </defs>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="category"
                                        type="category"
                                        stroke="currentColor"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={100}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar
                                        dataKey="amount"
                                        fill="url(#barGradient)"
                                        radius={[0, 4, 4, 0]}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Category Mix</Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="amount"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>Total Group Spend</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            ₹{data.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>Active Categories</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                            {data.length}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>Top Spend Category</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                            {data.length > 0 ? data.reduce((prev, current) => (prev.amount > current.amount) ? prev : current).category : 'None'}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
