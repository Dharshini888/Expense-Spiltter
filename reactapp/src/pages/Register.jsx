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
        InputAdornment,
        IconButton
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
        PersonAdd,
        Visibility,
        VisibilityOff,
        Email,
        Person
} from "@mui/icons-material";
import { motion } from "framer-motion";

export default function Register() {
        const { register } = useAuth();
        const nav = useNavigate();

        const [form, setForm] = useState({ name: "", email: "", password: "" });
        const [msg, setMsg] = useState("");
        const [loading, setLoading] = useState(false);
        const [showPassword, setShowPassword] = useState(false);

        const submit = async (e) => {
                e.preventDefault();
                setMsg("");
                setLoading(true);
                try {
                        await register(form);
                        setMsg("✅ Account created successfully! Redirecting...");
                        setTimeout(() => nav("/login"), 1500);
                } catch (e) {
                        setMsg(`❌ ${e.message || "Registration failed. Please try again."}`);
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
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                style={{ width: "100%", maxWidth: 480 }}
                        >
                                <Card className="glass-effect" sx={{ borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
                                        <Box sx={{ p: 5, textAlign: "center" }}>
                                                <Box sx={{
                                                        width: 60,
                                                        height: 60,
                                                        bgcolor: "secondary.main",
                                                        borderRadius: 1,
                                                        mx: "auto",
                                                        mb: 3,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 8px 16px rgba(168, 85, 247, 0.4)'
                                                }}>
                                                        <PersonAdd sx={{ fontSize: 30, color: '#fff' }} />
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }} className="text-gradient">
                                                        Join the Community
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                                        Start splitting expenses with ease and precision
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
                                                        <Stack spacing={2.5}>
                                                                <TextField
                                                                        label="Full Name"
                                                                        fullWidth
                                                                        variant="filled"
                                                                        value={form.name}
                                                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                                        required
                                                                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                                                                />

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
                                                                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'secondary.main' }}>
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
                                                                                mt: 2,
                                                                                borderRadius: 1,
                                                                                fontSize: "1rem",
                                                                                background: "var(--primary-gradient)",
                                                                                '&:hover': { filter: 'brightness(1.1)' }
                                                                        }}
                                                                >
                                                                        {loading ? "Creating Your Account..." : "Create Free Account"}
                                                                </Button>
                                                        </Stack>
                                                </form>

                                                <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 500 }} color="text.secondary">
                                                        Already member of Splitter?{" "}
                                                        <Link to="/login" style={{ textDecoration: "none", color: "#a855f7", fontWeight: 700 }}>
                                                                Sign In
                                                        </Link>
                                                </Typography>
                                        </CardContent>
                                </Card>
                        </motion.div>
                </Box>
        );
}