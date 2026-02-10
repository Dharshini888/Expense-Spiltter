import React, { useState } from "react";
import { Box, Typography, TextField, List, ListItem, ListItemText, IconButton, Card, CardContent, InputAdornment, Button, Chip, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion, AnimatePresence } from "framer-motion";
import { deleteGroup } from "../utils/api";

export default function GroupList({ groups, onSelect, selectedGroupId, onDelete }) {
    const [search, setSearch] = useState("");

    if (!groups || groups.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
                <Typography variant="body1" color="text.secondary">
                    No groups created yet. Start by creating one!
                </Typography>
            </motion.div>
        );
    }

    const filteredGroups = groups.filter((g) =>
        g.groupName.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (groupId, groupName, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${groupName}"?`)) {
            try {
                await deleteGroup(groupId);
                if (onDelete) onDelete(groupId, groupName);
            } catch (err) {
                console.error("Failed to delete group", err);
            }
        }
    };

    return (
        <Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Find a group..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="primary" />
                        </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: "background.paper" }
                }}
            />

            <List sx={{ p: 0 }}>
                <AnimatePresence mode="popLayout">
                    {filteredGroups.length === 0 ? (
                        <ListItem><Typography variant="body2" color="text.secondary">No groups match your search</Typography></ListItem>
                    ) : (
                        filteredGroups.map((g, index) => (
                            <motion.div
                                key={g.groupId}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card
                                    sx={{
                                        mb: 2,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        border: selectedGroupId === g.groupId ? "2px solid #6366f1" : "1px solid rgba(0,0,0,0.05)",
                                        "&:hover": { transform: "translateX(8px)", bgcolor: "rgba(99, 102, 241, 0.02)" }
                                    }}
                                    onClick={() => onSelect(g.groupId)}
                                >
                                    <CardContent sx={{ p: "16px !important", display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 3,
                                                bgcolor: "rgba(99, 102, 241, 0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "primary.main"
                                            }}
                                        >
                                            <GroupIcon />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {g.groupName}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip
                                                    label={`${g.members?.length || 0} members`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: "0.7rem" }}
                                                />
                                            </Stack>
                                        </Box>

                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => handleDelete(g.groupId, g.groupName, e)}
                                            sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <ChevronRightIcon color="disabled" />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </List>
        </Box>
    );
}
