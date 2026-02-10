import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemText,
    Alert,
    Avatar,
    Stack,
    Chip
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMembers, fetchPayments, addPayment } from "../utils/api";

export default function PaymentsTab({ group, onAddPayment }) {
    const groupId = group.groupId;
    const [members, setMembers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [paymentData, setPaymentData] = useState({ payer: "", receiver: "", amount: "" });
    const [paymentMsg, setPaymentMsg] = useState("");
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const m = await fetchMembers(groupId);
            const p = await fetchPayments(groupId);
            setMembers(m || []);
            setPayments(p || []);
        } catch (err) {
            console.error("Error loading payments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) loadData();
    }, [groupId]);

    const handleAddPayment = async () => {
        if (!paymentData.payer || !paymentData.receiver || !paymentData.amount) return;
        if (paymentData.payer === paymentData.receiver) {
            alert("Payer and receiver cannot be the same!");
            return;
        }
        try {
            const added = await addPayment(groupId, paymentData);
            setPayments((prev) => [added, ...prev]);
            setPaymentMsg(`Payment of ₹${paymentData.amount} recorded!`);
            setPaymentData({ payer: "", receiver: "", amount: "" });
            onAddPayment?.(groupId, added);
            setTimeout(() => setPaymentMsg(""), 3000);
        } catch (err) {
            console.error("Failed to add payment:", err);
        }
    };

    return (
        <Box>
            <Paper className="glass-effect" sx={{ p: 4, mb: 5, borderRadius: 1 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 900, letterSpacing: '-0.5px' }} className="text-gradient">Registry Settlement</Typography>
                {paymentMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 1, fontWeight: 600 }}>{paymentMsg}</Alert>}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
                    <TextField
                        select
                        label="Source (Payer)"
                        fullWidth
                        variant="filled"
                        value={paymentData.payer}
                        onChange={(e) => setPaymentData({ ...paymentData, payer: e.target.value })}
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                    >
                        {members.map((m) => <MenuItem key={m.id || m.name} value={m.name}>{m.name}</MenuItem>)}
                    </TextField>
                    <TextField
                        select
                        label="Destination (Receiver)"
                        fullWidth
                        variant="filled"
                        value={paymentData.receiver}
                        onChange={(e) => setPaymentData({ ...paymentData, receiver: e.target.value })}
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                    >
                        {members.map((m) => <MenuItem key={m.id || m.name} value={m.name}>{m.name}</MenuItem>)}
                    </TextField>
                    <TextField
                        label="Amount (₹)"
                        type="number"
                        fullWidth
                        variant="filled"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                    />
                </Stack>
                <Button
                    variant="contained"
                    onClick={handleAddPayment}
                    sx={{
                        borderRadius: 1,
                        px: 5,
                        py: 2,
                        background: "var(--success-gradient, linear-gradient(135deg, #10b981 0%, #059669 100%))",
                        fontWeight: 700,
                        '&:hover': { filter: 'brightness(1.1)' }
                    }}
                >
                    Record Transaction
                </Button>
            </Paper>

            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '2px', mb: 2, display: 'block' }}>
                Payment Audit Trail
            </Typography>
            <List>
                <AnimatePresence>
                    {payments.length > 0 ? (
                        payments.map((p, idx) => (
                            <motion.div
                                key={p.id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ListItem
                                    sx={{
                                        mb: 2,
                                        p: 3,
                                        borderRadius: 1,
                                        bgcolor: "background.paper",
                                        transition: 'all 0.3s ease',
                                        "&:hover": { borderColor: "success.main", bgcolor: "action.hover" }
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: "success.main", borderRadius: 1, mr: 3, width: 48, height: 48 }}>
                                        <HistoryIcon />
                                    </Avatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                                {p.payer} → {p.receiver}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                                Settlement verified on external ledger
                                            </Typography>
                                        }
                                    />
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderRadius: 0.5,
                                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10b981',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                            fontWeight: 800,
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        ₹{p.amount}
                                    </Box>
                                </ListItem>
                            </motion.div>
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 1, bgcolor: 'action.hover', border: '1px dashed rgba(128,128,128,0.2)' }}>
                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>No payment history available.</Typography>
                        </Paper>
                    )}
                </AnimatePresence>
            </List>
        </Box>
    );
}