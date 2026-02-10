import { useState } from "react";
import {
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Snackbar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Divider,
    Grid
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { createGroup } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const groupCategories = [
    { name: "Trip", icon: "✈️", color: "#10b981" },
    { name: "Home", icon: "🏠", color: "#6366f1" },
    { name: "Couple", icon: "❤️", color: "#ef4444" },
    { name: "Food", icon: "🍔", color: "#f59e0b" },
    { name: "Other", icon: "📦", color: "#6b7280" }
];

export default function CreateGroupForm({ onGroupAdded }) {
    const [groupName, setGroupName] = useState("");
    const [category, setCategory] = useState("Other");
    const [memberName, setMemberName] = useState("");
    const [members, setMembers] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAddMember = () => {
        if (!memberName.trim()) return;
        if (members.includes(memberName.trim())) {
            setError("Member already added.");
            return;
        }
        setMembers([...members, memberName.trim()]);
        setMemberName("");
        setError("");
    };

    const handleRemoveMember = (name) => {
        setMembers(members.filter(m => m !== name));
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || members.length === 0) {
            setError("Group name and at least one member are required.");
            return;
        }
        if (!user?.id) {
            setError("You must be logged in to create a group.");
            return;
        }

        setLoading(true);
        try {
            const newGroup = await createGroup({
                groupName: groupName.trim(),
                category,
                members,
                ownerId: user.id
            });

            setSuccess(true);
            if (onGroupAdded) onGroupAdded(newGroup);

            setTimeout(() => {
                navigate(`/groups`);
            }, 1000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 6 } }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Paper className="glass-effect" sx={{ borderRadius: 1, overflow: "hidden", border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ background: "var(--primary-gradient)", p: 4, color: "white", textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.5px' }}>🚀 New Group</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>Organize and split expenses with ease</Typography>
                    </Box>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                            </motion.div>
                        )}

                        <TextField
                            label="Group Name"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="e.g., Goa Trip 2024"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 }, "& .MuiInputLabel-root": { color: 'text.secondary' } }}
                        />

                        <Box sx={{ mt: 4, mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>Select Category</Typography>
                            <Grid container spacing={2}>
                                {groupCategories.map(cat => (
                                    <Grid item xs={6} sm={4} key={cat.name}>
                                        <Button
                                            fullWidth
                                            variant={category === cat.name ? "contained" : "outlined"}
                                            onClick={() => setCategory(cat.name)}
                                            sx={{
                                                height: 80,
                                                borderRadius: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                                borderColor: 'divider',
                                                color: category === cat.name ? 'white' : 'text.primary',
                                                bgcolor: category === cat.name ? 'primary.main' : 'transparent',
                                                '&:hover': { bgcolor: category === cat.name ? 'primary.dark' : 'action.hover' }
                                            }}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{cat.name}</span>
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>👥 Add Members</Typography>
                        <Box display="flex" gap={1} mb={3}>
                            <TextField
                                label="Member Name"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
                                placeholder="Add friends..."
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 }, "& .MuiInputLabel-root": { color: 'text.secondary' } }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddMember}
                                sx={{ borderRadius: 1, px: 4, fontWeight: 700 }}
                            >
                                Add
                            </Button>
                        </Box>

                        <Paper variant="outlined" sx={{ borderRadius: 1, bgcolor: "action.hover", minHeight: 100, mb: 4, border: '1px dashed', borderColor: 'divider' }}>
                            <List dense>
                                <AnimatePresence>
                                    {members.length === 0 ? (
                                        <Typography variant="body2" sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                                            No members added yet. Add at least one!
                                        </Typography>
                                    ) : (
                                        members.map((name, i) => (
                                            <motion.div key={name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                                                <ListItem
                                                    secondaryAction={
                                                        <IconButton edge="end" size="small" onClick={() => handleRemoveMember(name)} sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                                                            <span>🗑️</span>
                                                        </IconButton>
                                                    }
                                                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                                                >
                                                    <ListItemText
                                                        primary={name}
                                                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                                        secondary="Group Member"
                                                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                                                    />
                                                </ListItem>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </List>
                        </Paper>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleCreateGroup}
                            disabled={loading || success}
                            sx={{ height: 60, borderRadius: 1, fontSize: "1.1rem", fontWeight: 800, background: 'var(--accent-gradient)', mt: 2 }}
                        >
                            {loading ? "Creating Group..." : success ? "Group Created! 🎉" : "Launch Group"}
                        </Button>

                        <Snackbar
                            open={success}
                            autoHideDuration={3000}
                            onClose={() => setSuccess(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                                Group created successfully! Redirecting...
                            </Alert>
                        </Snackbar>
                    </CardContent>
                </Paper>
            </motion.div>
        </Box>
    );
}