import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Stack, Paper, Alert } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import TIPS_ICON from "@mui/icons-material/Lightbulb";
import Balances from "../components/Balances";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function BalancesTab({ group }) {
    const groupId = group.groupId;
    const { user } = useAuth();
    const [balances, setBalances] = useState([]);
    const [optimized, setOptimized] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const b = await api.fetchGroupBalances(groupId);
            setBalances(b);
        } catch (err) {
            console.error("Error fetching balances:", err);
        }
    }, [groupId]);

    useEffect(() => {
        if (groupId) fetchData();
    }, [groupId, fetchData]);

    const handleOptimize = async () => {
        try {
            const result = await api.optimizeSettlements(groupId);
            setOptimized(result);

            if (user?.name) {
                const suggs = await api.fetchSmartSuggestions(groupId, user.name);
                setSuggestions(suggs);
            }
        } catch (e) {
            console.error("Optimization failed", e);
        }
    };

    return (
        <Box>
            <Balances balances={balances} />

            <Box sx={{ my: 6 }}>
                <Paper className="glass-effect" sx={{ p: 4, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, opacity: 0.1 }}>
                        <AutoFixHighIcon sx={{ fontSize: 100 }} />
                    </Box>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }} className="text-gradient">Smart Settlement</Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                AI-powered debt minimization for your group.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AutoFixHighIcon />}
                            onClick={handleOptimize}
                            sx={{
                                borderRadius: 1,
                                py: 2,
                                px: 4,
                                background: "var(--accent-gradient)",
                                fontWeight: 700,
                                '&:hover': { filter: 'brightness(1.1)' }
                            }}
                        >
                            Optimize Debts
                        </Button>
                    </Stack>

                    {optimized.length > 0 ? (
                        <Stack spacing={2} sx={{ mt: 4 }}>
                            {optimized.map((s, idx) => (
                                <Paper key={idx} sx={{ p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover', transition: 'all 0.2s', '&:hover': { bgcolor: 'action.selected' } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>{s.from}</Typography>
                                            <Typography sx={{ mx: 2, color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>OWES</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>{s.to}</Typography>
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 900 }} className="text-gradient">₹{s.amount.toFixed(2)}</Typography>
                                    </Stack>
                                </Paper>
                            ))}

                            {suggestions.length > 0 && (
                                <Box sx={{ mt: 3, p: 3, borderRadius: 1, border: '1px solid', borderColor: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                        <TIPS_ICON color="primary" />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>Smart Settle Suggestions</Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {suggestions.map((msg, i) => (
                                            <Typography key={i} variant="body2" sx={{ color: 'text.primary', fontWeight: 500, display: 'flex', gap: 1 }}>
                                                <span>💡</span> {msg}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            <Alert icon={false} sx={{ mt: 2, borderRadius: 1, border: '1px solid', borderColor: 'success.main', bgcolor: 'success.light', color: 'success.dark', fontWeight: 700 }}>
                                ✨ Optimized! Saved matching transactions for total group efficiency.
                            </Alert>
                        </Stack>
                    ) : (
                        <Box sx={{ mt: 4, p: 4, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 1, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                Click "Optimize Debts" to calculate the most efficient way for everyone to settle up.
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
