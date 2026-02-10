import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Stack,
    IconButton,
    Divider
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMembers, addMember } from "../utils/api";

export default function MembersTab({ group, onMemberAdded }) {
    const groupId = group.groupId;
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState("");
    const [loading, setLoading] = useState(true);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const m = await fetchMembers(groupId);
            setMembers(m || []);
        } catch (err) {
            console.error("Error fetching members:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) loadMembers();
    }, [groupId]);

    const handleAddMember = async () => {
        if (!newMember.trim()) return;
        try {
            const added = await addMember(groupId, newMember);
            setMembers((prev) => [...prev, { id: added.memberId, name: added.name }]);
            setNewMember("");
            onMemberAdded?.(groupId, added);
        } catch (err) {
            console.error("Failed to add member:", err);
        }
    };

    return (
        <Box>
            <Paper className="glass-effect" sx={{ p: 4, mb: 5, borderRadius: 1 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 900, letterSpacing: '-0.5px' }} className="text-gradient">Provision New Member</Typography>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Full Name"
                        fullWidth
                        variant="filled"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        placeholder="e.g. John Doe, Sarah Smith"
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1 } }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddMember}
                        sx={{
                            borderRadius: 1,
                            px: 5,
                            whiteSpace: "nowrap",
                            background: "var(--accent-gradient)",
                            fontWeight: 700
                        }}
                    >
                        Add Member
                    </Button>
                </Stack>
            </Paper>

            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '2px', mb: 2, display: 'block' }}>
                Active Members ({members.length})
            </Typography>
            <List container component={Box} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                <AnimatePresence>
                    {members.map((m, idx) => (
                        <motion.div
                            key={m.id || m.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <ListItem
                                sx={{
                                    p: 3,
                                    borderRadius: 1,
                                    bgcolor: "background.paper",
                                    transition: 'all 0.3s ease',
                                    "&:hover": { borderColor: "secondary.main", bgcolor: "action.hover" }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: "secondary.main",
                                        borderRadius: 1,
                                        mr: 3,
                                        width: 50,
                                        height: 50,
                                        boxShadow: '0 4px 10px rgba(168, 85, 247, 0.3)'
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <ListItemText
                                    primary={<Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{m.name}</Typography>}
                                    secondary={<Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Group Delegate</Typography>}
                                />
                                <IconButton size="small" sx={{ color: 'error.main', opacity: 0.4, "&:hover": { opacity: 1, bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </List>
        </Box>
    );
}
