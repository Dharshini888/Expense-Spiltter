import React, { useMemo } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Avatar,
    Paper,
    Divider,
    Chip,
    LinearProgress
} from "@mui/material";
import {
    TrendingUp,
    Group,
    Receipt,
    Wallet,
    TrendingDown,
    Schedule
} from "@mui/icons-material";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"];

export default function Dashboard({ groups = [] }) {
    const { user } = useAuth();

    // 1. Calculate Stats
    // 1. Calculate Stats & Chart Data
    const { stats, chartData } = useMemo(() => {
        let totalSpend = 0;
        let userPaidTotal = 0;
        let recentExpenses = [];
        const categoryMap = {};
        const dailySpend = {};

        groups.forEach(g => {
            const expenses = g.expenses || [];
            expenses.forEach(e => {
                const amount = Number(e.amount) || 0;
                totalSpend += amount;

                if (e.payer === user?.name) {
                    userPaidTotal += amount;
                }

                const cat = e.category || "General";
                categoryMap[cat] = (categoryMap[cat] || 0) + amount;

                const dateKey = new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' });
                dailySpend[dateKey] = (dailySpend[dateKey] || 0) + amount;

                recentExpenses.push({
                    ...e,
                    groupName: g.groupName,
                    id: e.expenseId
                });
            });
        });

        const sortedRecent = recentExpenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const categoryData = Object.keys(categoryMap).map(name => ({
            name,
            value: categoryMap[name]
        }));

        // Generate chart data for the last 7 days (or just what we have)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date().getDay();
        const orderedChartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = days[(today - i + 7) % 7];
            orderedChartData.push({ name: d, amount: dailySpend[d] || 0 });
        }

        return {
            stats: {
                totalSpend,
                userPaidTotal,
                sortedRecent,
                categoryData,
                groupCount: groups.length,
                expenseCount: recentExpenses.length
            },
            chartData: orderedChartData
        };
    }, [groups, user]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: '-1px' }} className="text-gradient">
                            Welcome back, {user?.name || "Guest"}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Aggregated insights from {stats.groupCount} active ledgers.
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "primary.main",
                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
                            borderRadius: 1
                        }}
                    >
                        {(user?.name || "U")[0]}
                    </Avatar>
                </Stack>

                {/* Stat Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 3, borderRadius: 1, bgcolor: "primary.main", color: "white", border: 'none' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", borderRadius: 1 }}><Wallet /></Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Volume</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900 }}>₹{stats.totalSpend.toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 3, borderRadius: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.1)", color: "success.main", borderRadius: 1 }}><TrendingUp /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Share</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>₹{stats.userPaidTotal.toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 3, borderRadius: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "rgba(168, 85, 247, 0.1)", color: "secondary.main", borderRadius: 1 }}><Group /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Units</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{stats.groupCount}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 3, borderRadius: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "rgba(245, 158, 11, 0.1)", color: "warning.main", borderRadius: 1 }}><Receipt /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Audit Items</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{stats.expenseCount}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Charts Area */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={8}>
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 3, borderRadius: 1, height: "100%" }}>
                                <Typography variant="overline" sx={{ mb: 3, display: 'block', fontWeight: 800, letterSpacing: '2px', color: 'primary.main' }}>Spending Velocity (7 Days)</Typography>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12, fontWeight: 600 }}
                                            />
                                            <YAxis hide />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '4px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                    backgroundColor: 'var(--bg-slate)',
                                                    color: 'var(--text-main)'
                                                }}
                                            />
                                            <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={4} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 3, borderRadius: 1, height: "100%" }}>
                                <Typography variant="overline" sx={{ mb: 3, display: 'block', fontWeight: 800, letterSpacing: '2px', color: 'secondary.main' }}>Categorical Mix</Typography>
                                <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: 'center' }}>
                                    {stats.categoryData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.categoryData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {stats.categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box sx={{ textAlign: "center" }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Zero audit data available</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Recent Activity */}
                <motion.div variants={itemVariants}>
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '2px', color: 'text.primary' }}>Recent Audit Trail</Typography>
                            <Chip label="LIVE SYNC" icon={<Schedule />} size="small" color="primary" sx={{ fontWeight: 800, borderRadius: 1 }} />
                        </Stack>
                        <Stack spacing={2.5}>
                            {stats.sortedRecent.length > 0 ? (
                                stats.sortedRecent.map((r, idx) => (
                                    <Box key={idx}>
                                        <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: "rgba(99, 102, 241, 0.1)", color: "primary.main", borderRadius: 1 }}>
                                                    <Receipt fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>{r.description}</Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{r.groupName} • {r.payer}</Typography>
                                                </Box>
                                            </Stack>
                                            <Typography sx={{ fontWeight: 900, color: "primary.main", fontSize: '1.1rem' }}>₹{Number(r.amount).toLocaleString()}</Typography>
                                        </Stack>
                                        {idx < stats.sortedRecent.length - 1 && <Divider sx={{ mt: 2.5, opacity: 0.05 }} />}
                                    </Box>
                                ))
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>No transaction history discovered.</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Paper>
                </motion.div>
            </motion.div>
        </Box>
    );
}