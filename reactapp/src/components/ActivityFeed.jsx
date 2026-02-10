import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';
import api from '../utils/api';

export default function ActivityFeed({ groupId, refreshTrigger }) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.fetchActivities(groupId);
                setActivities(data);
            } catch (e) {
                console.error("Failed to load activities", e);
            }
        };
        load();
    }, [groupId, refreshTrigger]);

    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '2px', mb: 2, display: 'block' }}>Live Activity Audit</Typography>
            <Stack spacing={2}>
                {activities.length === 0 ? (
                    <Paper className="glass-effect" sx={{ p: 4, borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>No recent activity to report.</Typography>
                    </Paper>
                ) : (
                    activities.map((a, idx) => (
                        <Paper
                            key={a.id || idx}
                            sx={{
                                p: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: 1,
                                bgcolor: 'action.hover',
                                transition: 'all 0.2s ease',
                                '&:hover': { bgcolor: 'action.selected', transform: 'translateX(4px)' }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 4,
                                    height: 40,
                                    bgcolor: 'primary.main',
                                    mr: 3,
                                    borderRadius: 0,
                                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                                }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 600 }}>{a.message}</Typography>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700, mt: 0.5, textTransform: 'uppercase' }}>
                                    {format(new Date(a.createdAt), 'MMM dd • HH:mm')}
                                </Typography>
                            </Box>
                        </Paper>
                    ))
                )}
            </Stack>
        </Box>
    );
}
