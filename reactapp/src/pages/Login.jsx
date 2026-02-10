import React, { useState } from "react";
import {
        Card,
        CardContent,
        TextField,
        Button,
        Typography,
        Alert,
        Box,
        Stack,
        IconButton,
        InputAdornment
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function Login() {
        const { login } = useAuth();
        const nav = useNavigate();

        const [form, setForm] = useState({ email: "", password: "" });
        const [msg, setMsg] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const [loading, setLoading] = useState(false);

        const submit = async (e) => {
                e.preventDefault();
                setMsg("");
                setLoading(true);
                try {
                        await login(form);
                        setMsg("✅ Success! Redirecting...");
                        setTimeout(() => nav("/groups"), 1000);
                } catch (err) {
                        setMsg(`❌ ${err.message || "Invalid email or password"}`);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <Box
                        sx={{
                                minHeight: "90vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 3
                        }}
                >
                        <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{ width: "100%", maxWidth: 450 }}
                        >
                                <Card className="glass-effect" sx={{ borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden", position: 'relative' }}>
                                        <Box sx={{ p: 5, textAlign: "center", position: 'relative' }}>
                                                <Box sx={{
                                                        width: 60,
                                                        height: 60,
                                                        bgcolor: "primary.main",
                                                        borderRadius: 1,
                                                        mx: "auto",
                                                        mb: 3,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
                                                }}>
                                                        <LoginIcon sx={{ fontSize: 30, color: '#fff' }} />
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }} className="text-gradient">
                                                        Welcome Back
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                                        Access your shared expenses dashboard
                                                </Typography>
                                        </Box>
                                        <CardContent sx={{ p: 5, pt: 0 }}>
                                                {msg && (
                                                        <Alert
                                                                severity={msg.startsWith("✅") ? "success" : "error"}
                                                                sx={{ mb: 4, borderRadius: 1, fontWeight: 600 }}
                                                        >
                                                                {msg}
                                                        </Alert>
                                                )}

                                                <form onSubmit={submit}>
                                                        <Stack spacing={3}>
                                                                <TextField
                                                                        label="Email Address"
                                                                        type="email"
                                                                        fullWidth
                                                                        variant="filled"
                                                                        value={form.email}
                                                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                                        required
                                                                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                                                                />

                                                                <TextField
                                                                        label="Password"
                                                                        type={showPassword ? "text" : "password"}
                                                                        fullWidth
                                                                        variant="filled"
                                                                        value={form.password}
                                                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                                        required
                                                                        InputProps={{
                                                                                disableUnderline: true,
                                                                                sx: { borderRadius: 1 },
                                                                                endAdornment: (
                                                                                        <InputAdornment position="end">
                                                                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'primary.main' }}>
                                                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                                                </IconButton>
                                                                                        </InputAdornment>
                                                                                ),
                                                                        }}
                                                                />

                                                                <Button
                                                                        fullWidth
                                                                        variant="contained"
                                                                        size="large"
                                                                        type="submit"
                                                                        disabled={loading}
                                                                        sx={{
                                                                                height: 60,
                                                                                borderRadius: 1,
                                                                                fontSize: "1rem",
                                                                                background: "var(--primary-gradient)",
                                                                                '&:hover': { filter: 'brightness(1.1)' }
                                                                        }}
                                                                >
                                                                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                                                                </Button>
                                                        </Stack>
                                                </form>

                                                <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 500 }} color="text.secondary">
                                                        New to Expense Splitter?{" "}
                                                        <Link to="/register" style={{ textDecoration: "none", color: "#6366f1", fontWeight: 700 }}>
                                                                Create Account
                                                        </Link>
                                                </Typography>
                                        </CardContent>
                                </Card>
                        </motion.div>
                </Box>
        );
}
