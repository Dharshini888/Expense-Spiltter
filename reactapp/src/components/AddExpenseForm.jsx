import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Button,
    Paper,
    Grid,
    TextField,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    Alert,
    Stack
} from "@mui/material";

const categories = [
    { name: "Food", icon: "🍔", color: "#f59e0b", keywords: ["food", "pizza", "burger", "dinner", "lunch", "breakfast", "restaurant", "cafe", "swiggy", "zomato"] },
    { name: "Travel", icon: "🚕", color: "#10b981", keywords: ["taxi", "uber", "ola", "flight", "bus", "train", "travel", "fuel", "petrol", "parking"] },
    { name: "Rent", icon: "🏠", color: "#ef4444", keywords: ["rent", "maintenance", "electricity", "water", "bill"] },
    { name: "Groceries", icon: "🛒", color: "#3b82f6", keywords: ["grocery", "market", "milk", "vegetables", "fruits", "mart"] },
    { name: "Entertainment", icon: "🎉", color: "#8b5cf6", keywords: ["movie", "party", "club", "game", "netflix", "concert"] },
    { name: "Other", icon: "📦", color: "#6b7280", keywords: [] }
];

const splitTypes = [
    { value: "EQUAL", label: "Equal Split", icon: "⚖️" },
    { value: "EXACT", label: "Exact Amounts", icon: "💰" },
    { value: "PERCENT", label: "Percentage %", icon: "📊" },
    { value: "SHARE", label: "Share-based", icon: "🔢" }
];

export default function AddExpenseForm({ groupId, members, onAddExpense, postAdd }) {
    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState("Other");
    const [splitType, setSplitType] = useState("EQUAL");
    const [dueDate, setDueDate] = useState("");
    const [attachmentUrl, setAttachmentUrl] = useState("");

    // splits state: { mId: value }
    const [splits, setSplits] = useState({});
    const [error, setError] = useState("");

    // AI Category Suggestion
    useEffect(() => {
        const d = desc.toLowerCase();
        for (const cat of categories) {
            if (cat.keywords.some(k => d.includes(k))) {
                setCategory(cat.name);
                break;
            }
        }
    }, [desc]);

    const initializeSplits = useCallback(() => {
        if (members && members.length > 0) {
            const initial = {};
            members.forEach(m => initial[m.id] = 0);
            setSplits(initial);
        }
    }, [members]);

    useEffect(() => {
        initializeSplits();
    }, [initializeSplits]);

    const handleSplitChange = (mId, val) => {
        setSplits(prev => ({ ...prev, [mId]: val }));
    };

    const handleSubmit = async () => {
        setError("");

        if (!desc || !amount || parseFloat(amount) <= 0 || !payer || !date) {
            setError("Fill all mandatory fields correctly");
            return;
        }

        try {
            const splitList = Object.keys(splits).map(mId => {
                const val = parseFloat(splits[mId]) || 0;
                const field = splitType === "EXACT" ? "amount" : splitType === "PERCENT" ? "percent" : "shares";
                return { memberId: parseInt(mId), [field]: val };
            });

            const expenseData = {
                description: desc,
                amount: parseFloat(amount),
                payer,
                date,
                category,
                splitType,
                dueDate: dueDate || null,
                attachmentUrl: attachmentUrl || null,
                splits: splitType === "EQUAL" ? [] : splitList
            };

            await onAddExpense(groupId, expenseData);
            postAdd();

            // Clear form
            setDesc("");
            setAmount("");
            setPayer("");
            setCategory("Other");
            setSplitType("EQUAL");
        } catch (err) {
            setError(err.message || "Failed to add expense");
        }
    };

    return (
        <Paper data-testid="add-expense-form" className="glass-effect" sx={{ p: 4, mb: 4, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }} className="text-gradient">Add New Expense</Typography>
            {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        data-testid="desc-input"
                        placeholder="What was it for?"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Amount (₹)"
                        type="number"
                        variant="outlined"
                        data-testid="amount-input"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#94a3b8' }}>Payer</InputLabel>
                        <Select
                            value={payer}
                            label="Payer"
                            data-testid="payer-select"
                            onChange={(e) => setPayer(e.target.value)}
                            sx={{ borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' } }}
                        >
                            <MenuItem value=""><em>Select Payer</em></MenuItem>
                            {members.map((m) => (
                                <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#94a3b8' }}>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                            sx={{ borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' } }}
                        >
                            {categories.map(c => (
                                <MenuItem key={c.name} value={c.name}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>{c.icon}</span>
                                        {c.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        data-testid="date-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1, display: 'block' }}>Split Type</Typography>
                    <Stack direction="row" spacing={2}>
                        {splitTypes.map(st => (
                            <Button
                                key={st.value}
                                variant={splitType === st.value ? "contained" : "outlined"}
                                onClick={() => setSplitType(st.value)}
                                sx={{
                                    flexGrow: 1,
                                    py: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: splitType === st.value ? 'white' : '#94a3b8',
                                    bgcolor: splitType === st.value ? 'primary.main' : 'transparent',
                                    '&:hover': { bgcolor: splitType === st.value ? 'primary.dark' : 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                <Box sx={{ fontSize: '1.5rem', mb: 0.5 }}>{st.icon}</Box>
                                {st.label}
                            </Button>
                        ))}
                    </Stack>
                </Grid>

                {splitType !== "EQUAL" && (
                    <Grid item xs={12}>
                        <Box sx={{ p: 4, borderRadius: 1, bgcolor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2 }}>Individual {splitType} Splits</Typography>
                            <Grid container spacing={2}>
                                {members.map(m => (
                                    <Grid item xs={12} key={m.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: 'white' }}>{m.name}</Typography>
                                        <TextField
                                            size="sm"
                                            type="number"
                                            value={splits[m.id] || ""}
                                            onChange={(e) => handleSplitChange(m.id, e.target.value)}
                                            placeholder={splitType === "EXACT" ? "Amount" : splitType === "PERCENT" ? "Percent" : "Shares"}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end" sx={{ '& .MuiTypography-root': { color: '#94a3b8' } }}>{splitType === "EXACT" ? "₹" : splitType === "PERCENT" ? "%" : "sh"}</InputAdornment>,
                                            }}
                                            sx={{
                                                width: '150px',
                                                '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 1 },
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Due Date (Optional)"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Attachment/Receipt URL"
                        placeholder="https://..."
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        data-testid="add-expense-button"
                        className="btn-premium"
                        onClick={handleSubmit}
                        sx={{ py: 2.5, fontSize: '1.1rem', fontWeight: 700, borderRadius: 1, background: 'var(--primary-gradient)' }}
                    >
                        Create Expense
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
