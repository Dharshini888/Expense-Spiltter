import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, TextField, InputAdornment, Pagination, IconButton, Snackbar, Alert, Card, CardContent, Stack, Chip, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { motion, AnimatePresence } from "framer-motion";
import { deleteGroup } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const categoryIcons = {
        "Trip": "✈️",
        "Home": "🏠",
        "Couple": "❤️",
        "Food": "🍔",
        "Other": "📦"
};

export default function Groups({ groups = [], refreshGroups }) {
        const navigate = useNavigate();
        const { user } = useAuth();
        const [searchTerm, setSearchTerm] = useState("");
        const [page, setPage] = useState(1);
        const itemsPerPage = 6;

        const [snackbar, setSnackbar] = useState({
                open: false,
                message: "",
                severity: "success",
        });

        // Filter by search term and implicitly by user groups passed from App.js (which fetches with ownerId)
        const filteredGroups = useMemo(
                () => groups.filter((g) => g.groupName.toLowerCase().includes(searchTerm.toLowerCase())),
                [groups, searchTerm]
        );

        const pageCount = Math.ceil(filteredGroups.length / itemsPerPage);
        const paginatedGroups = useMemo(
                () => filteredGroups.slice((page - 1) * itemsPerPage, page * itemsPerPage),
                [filteredGroups, page]
        );

        const handlePageChange = (_, value) => {
                setPage(value);
                window.scrollTo({ top: 0, behavior: "smooth" });
        };

        const handleDelete = async (groupId) => {
                if (window.confirm("Are you sure you want to delete this group?")) {
                        try {
                                await deleteGroup(groupId);
                                setSnackbar({
                                        open: true,
                                        message: "Group deleted successfully!",
                                        severity: "success",
                                });
                                if (refreshGroups) refreshGroups();
                        } catch (err) {
                                setSnackbar({
                                        open: true,
                                        message: "Failed to delete group.",
                                        severity: "error",
                                });
                        }
                }
        };

        return (
                <Box p={4} sx={{ maxWidth: 1400, mx: "auto" }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6, flexWrap: "wrap", gap: 3 }}>
                                        <Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>My Groups</Typography>
                                                <Typography variant="h6" color="text.secondary">Welcome back, {user?.name || "Member"}. Manage your shared expenses.</Typography>
                                        </Box>
                                        <Button
                                                variant="contained"
                                                className="btn-primary"
                                                startIcon={<AddIcon />}
                                                sx={{ height: 56, px: 4, borderRadius: 3, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" }}
                                                onClick={() => navigate("/groups/create")}
                                        >
                                                Create New Group
                                        </Button>
                                </Box>
                        </motion.div>

                        {/* Controls */}
                        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                                <TextField
                                        placeholder="Search your groups..."
                                        variant="outlined"
                                        sx={{ maxWidth: 500, flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "background.paper" } }}
                                        value={searchTerm}
                                        onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setPage(1);
                                        }}
                                        InputProps={{
                                                startAdornment: (
                                                        <InputAdornment position="start">
                                                                <SearchIcon color="primary" />
                                                        </InputAdornment>
                                                ),
                                        }}
                                />
                        </Box>

                        {/* Grid */}
                        <Grid container spacing={4}>
                                <AnimatePresence>
                                        {paginatedGroups.length > 0 ? (
                                                paginatedGroups.map((group, index) => (
                                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.groupId}>
                                                                <motion.div
                                                                        layout
                                                                        initial={{ opacity: 0, y: 30 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.1 }}
                                                                >
                                                                        <Card
                                                                                onClick={() => navigate(`/groups/${group.groupId}`)}
                                                                                className="card-premium"
                                                                                sx={{
                                                                                        borderRadius: 1, // Strategic boxy feel
                                                                                        height: "100%",
                                                                                        cursor: "pointer"
                                                                                }}
                                                                        >
                                                                                <CardContent sx={{ p: 4 }}>
                                                                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
                                                                                                <Box sx={{ p: 2, bgcolor: "rgba(99, 102, 241, 0.1)", borderRadius: 1.5, color: "primary.main", fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                                        {group.category ? (categoryIcons[group.category] || "📦") : <GroupIcon sx={{ fontSize: 32 }} />}
                                                                                                </Box>
                                                                                                <IconButton
                                                                                                        size="small"
                                                                                                        color="error"
                                                                                                        onClick={(e) => { e.stopPropagation(); handleDelete(group.groupId); }}
                                                                                                        sx={{ borderRadius: 1, bgcolor: "rgba(239, 68, 68, 0.05)", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}
                                                                                                >
                                                                                                        <DeleteIcon />
                                                                                                </IconButton>
                                                                                        </Stack>

                                                                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
                                                                                                {group.groupName}
                                                                                        </Typography>
                                                                                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                                                                                                Created by {user?.name === group.ownerName ? "you" : group.ownerName || "Owner"}
                                                                                        </Typography>

                                                                                        <Divider sx={{ mb: 3, opacity: 0.1 }} />

                                                                                        <Stack direction="row" spacing={1.5}>
                                                                                                <Chip
                                                                                                        label={`${group.members?.length || 0} Members`}
                                                                                                        size="small"
                                                                                                        sx={{ borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)', bgcolor: "rgba(255,255,255,0.03)", fontWeight: 600 }}
                                                                                                />
                                                                                                <Chip
                                                                                                        label={`${group.expenses?.length || 0} Expenses`}
                                                                                                        size="small"
                                                                                                        sx={{ borderRadius: 1, border: '1px solid rgba(16, 185, 129, 0.1)', bgcolor: "rgba(16, 185, 129, 0.03)", color: "#10b981", fontWeight: 600 }}
                                                                                                />
                                                                                        </Stack>
                                                                                </CardContent>
                                                                        </Card>
                                                                </motion.div>
                                                        </Grid>
                                                ))
                                        ) : (
                                                <Grid size={{ xs: 12 }}>
                                                        <Box sx={{ textAlign: "center", py: 10, bgcolor: "background.paper", borderRadius: 4 }}>
                                                                <GroupIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                                                                <Typography variant="h5" color="text.secondary">No groups found here.</Typography>
                                                                <Button variant="text" sx={{ mt: 2 }} onClick={() => navigate("/groups/create")}>Build your first group!</Button>
                                                        </Box>
                                                </Grid>
                                        )}
                                </AnimatePresence>
                        </Grid>

                        {/* Pagination */}
                        {pageCount > 1 && (
                                <Box mt={6} display="flex" justifyContent="center">
                                        <Pagination
                                                count={pageCount}
                                                page={page}
                                                onChange={handlePageChange}
                                                size="large"
                                                sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
                                        />
                                </Box>
                        )}

                        <Snackbar
                                open={snackbar.open}
                                autoHideDuration={3000}
                                onClose={() => setSnackbar({ ...snackbar, open: false })}
                        >
                                <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
                        </Snackbar>
                </Box>
        );
}