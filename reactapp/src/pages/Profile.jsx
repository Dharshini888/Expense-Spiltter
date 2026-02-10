
import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, Box, Avatar, Stack, Alert } from "@mui/material";

import { useAuth } from "../context/AuthContext";



export default function Profile() {

    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const save = async () => {
        setMsg("Profile updated successfully");
        setTimeout(() => setMsg(""), 3000);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card className="glass-effect" sx={{ maxWidth: 600, mx: "auto", mt: 4, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'primary.main',
                                mx: 'auto',
                                mb: 2,
                                borderRadius: 1,
                                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
                            }}
                        >
                            <Typography variant="h3" sx={{ fontWeight: 800 }}>{name.charAt(0)}</Typography>
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }} className="text-gradient">My Profile</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Manage your personal account settings</Typography>
                    </Box>

                    {msg && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            {msg}
                        </Alert>
                    )}

                    <Stack spacing={3}>
                        <TextField
                            label="Full name"
                            fullWidth
                            variant="filled"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                        />
                        <TextField
                            label="Email Address"
                            fullWidth
                            variant="filled"
                            value={email}
                            disabled
                            InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                            helperText="Email cannot be changed"
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            className="btn-premium"
                            onClick={save}
                            sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700, borderRadius: 1 }}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );

}