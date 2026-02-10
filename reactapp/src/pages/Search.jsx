// src/pages/Search.jsx
import React, { useState } from "react";
import { Card, CardContent, TextField, Typography, List, ListItem, ListItemText, Divider, Box, Button, InputAdornment, Grid, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Search() {
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [groupResults, setGR] = useState([]);
    const [expenseResults, setER] = useState([]);
    const [groupId, setGroupId] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSearch = async () => {
        if (q.trim().length === 0) return;
        setLoading(true);
        try {
            const gr = await api.searchGroups(q, user?.id);
            setGR(gr);

            if (groupId) {
                const er = await api.searchExpenses(groupId, q);
                setER(er);
            } else {
                setER([]);
            }
        } catch (e) {
            console.error("Search failed:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="glass-effect" sx={{ maxWidth: 1000, mx: "auto", overflow: "visible", borderRadius: 1 }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, mb: 4 }} className="text-gradient">
                            Global Discovery
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 5 }}>
                            <TextField
                                label="Search across groups and expenses"
                                variant="filled"
                                value={q}
                                onChange={e => setQ(e.target.value)}
                                sx={{ flex: 2, minWidth: "300px" }}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { borderRadius: 1 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Target Group ID"
                                variant="filled"
                                placeholder="Optional filter"
                                value={groupId}
                                onChange={e => setGroupId(e.target.value)}
                                sx={{ flex: 1, minWidth: "200px" }}
                                InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                            />
                            <Button
                                variant="contained"
                                className="btn-premium"
                                onClick={handleSearch}
                                disabled={loading}
                                sx={{ px: 6, height: "56px", borderRadius: 1 }}
                            >
                                {loading ? "Scanning..." : "Search"}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 5, opacity: 0.1 }} />

                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="overline" sx={{ mb: 3, display: 'block', fontWeight: 800, letterSpacing: '2px', color: 'primary.main' }}>
                                    Matching Groups
                                </Typography>
                                <List>
                                    <AnimatePresence>
                                        {groupResults.length === 0 ? (
                                            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 1, bgcolor: 'action.hover', border: '1px dashed rgba(128,128,128,0.2)' }}>
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>No matching groups discovered.</Typography>
                                            </Paper>
                                        ) : (
                                            groupResults.map((g, idx) => (
                                                <motion.div
                                                    key={g.groupId}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <ListItem
                                                        onClick={() => navigate(`/groups/${g.groupId}`)}
                                                        sx={{
                                                            mb: 2,
                                                            p: 2.5,
                                                            borderRadius: 1,
                                                            bgcolor: "background.paper",
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                            "&:hover": {
                                                                borderColor: "primary.main",
                                                                bgcolor: "action.hover",
                                                                transform: 'translateX(8px)'
                                                            }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={g.groupName}
                                                            secondary={`Ledger ID: ${g.groupId}`}
                                                            primaryTypographyProps={{ fontWeight: 800, color: 'text.primary', fontSize: '1.1rem' }}
                                                            secondaryTypographyProps={{ fontWeight: 600, color: 'text.secondary' }}
                                                        />
                                                    </ListItem>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </List>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="overline" sx={{ mb: 3, display: 'block', fontWeight: 800, letterSpacing: '2px', color: 'secondary.main' }}>
                                    Related Expenses
                                </Typography>
                                <List>
                                    <AnimatePresence>
                                        {expenseResults.length === 0 ? (
                                            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 1, bgcolor: 'action.hover', border: '1px dashed rgba(128,128,128,0.2)' }}>
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {groupId ? "No matching expenses found." : "Specify a Group ID to search ledger items."}
                                                </Typography>
                                            </Paper>
                                        ) : (
                                            expenseResults.map((e, idx) => (
                                                <motion.div
                                                    key={e.expenseId}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <ListItem
                                                        sx={{
                                                            mb: 2,
                                                            p: 2.5,
                                                            borderRadius: 1,
                                                            bgcolor: "background.paper",
                                                            transition: 'all 0.3s ease',
                                                            "&:hover": { borderColor: "secondary.main", bgcolor: "action.hover" }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={e.description}
                                                            secondary={`₹${Number(e.amount).toFixed(2)} • ${e.payer} • ${new Date(e.date).toLocaleDateString()}`}
                                                            primaryTypographyProps={{ fontWeight: 800, color: 'text.primary' }}
                                                            secondaryTypographyProps={{ fontWeight: 600, color: 'text.secondary' }}
                                                        />
                                                    </ListItem>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </List>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
}