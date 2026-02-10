import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    MenuItem,
    Box,
    Paper,
    Stack,
    Alert,
    CircularProgress
} from "@mui/material";
import { ArrowBack, Receipt } from "@mui/icons-material";
import { fetchMembers, addExpense } from "../utils/api";

export default function AddExpensePage({ groups = [], onAddExpense }) {
    const { groupId: paramGroupId } = useParams();
    const navigate = useNavigate();

    const [groupId, setGroupId] = useState(paramGroupId || "");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("");
    const [category, setCategory] = useState("General");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const activeGroup = groups.find(g => g.groupId.toString() === groupId.toString());

    useEffect(() => {
        if (groupId) {
            fetchMembers(groupId)
                .then(setMembers)
                .catch(() => {
                    setError("Failed to load group members.");
                    setMembers([]);
                });
        }
    }, [groupId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupId || !description || !amount || !payer) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await onAddExpense?.(groupId, {
                description,
                amount: parseFloat(amount),
                payer,
                category,
                date: new Date().toISOString().split('T')[0]
            });
            navigate(`/groups/${groupId}`);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Paper sx={{ p: 4, borderRadius: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Receipt color="primary" />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Add New Expense</Typography>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    {!paramGroupId && (
                        <TextField
                            select
                            label="Select Group"
                            fullWidth
                            margin="normal"
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            required
                        >
                            {groups.map((g) => (
                                <MenuItem key={g.groupId} value={g.groupId}>
                                    {g.groupName}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What was this for?"
                        required
                    />

                    <TextField
                        label="Amount (₹)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <TextField
                        select
                        label="Paid By"
                        fullWidth
                        margin="normal"
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        required
                        disabled={!groupId || members.length === 0}
                    >
                        {members.map((m) => (
                            <MenuItem key={m.id} value={m.name}>
                                {m.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Category"
                        fullWidth
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {["General", "Food", "Transport", "Shopping", "Entertainment", "Utilities"].map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{ height: 56, borderRadius: 3 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Add Expense"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}