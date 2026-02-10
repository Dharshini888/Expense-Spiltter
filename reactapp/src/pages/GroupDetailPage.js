import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
        Tabs,
        Tab,
        Box,
        Typography,
        Paper,
        IconButton,
        Stack,
        Breadcrumbs,
        Link as MuiLink,
        Container,
        Grid
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentIcon from "@mui/icons-material/Payment";
import { motion, AnimatePresence } from "framer-motion";

import ExpensesTab from "./ExpensesTab";
import MembersTab from "./MembersTab";
import BalancesTab from "./BalancesTab";
import PaymentsTab from "./PaymentsTab";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ActivityFeed from "../components/ActivityFeed";

export default function GroupDetailPage({ groups, onAddExpense, onAddMember, refreshGroups }) {
        const { groupId } = useParams();
        const navigate = useNavigate();
        const [tabIndex, setTabIndex] = useState(0);
        const [refreshTrigger, setRefreshTrigger] = useState(0);

        const group = useMemo(() =>
                groups.find((g) => String(g.groupId) === String(groupId)),
                [groups, groupId]
        );

        if (!group) {
                return (
                        <Container sx={{ mt: 10, textAlign: "center" }}>
                                <Typography variant="h5" color="text.secondary">Group not found.</Typography>
                                <IconButton onClick={() => navigate("/groups")} sx={{ mt: 2 }}>
                                        <ArrowBackIcon />
                                </IconButton>
                        </Container>
                );
        }

        const handleTabChange = (event, newValue) => {
                setTabIndex(newValue);
        };

        const handleExpenseAdded = async (gid, expense) => {
                await onAddExpense?.(gid, expense);
                await refreshGroups?.();
        };

        return (
                <Container maxWidth="xl" sx={{ py: 4 }}>
                        <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                        >
                                <Breadcrumbs sx={{ mb: 2 }}>
                                        <MuiLink
                                                component="button"
                                                variant="body2"
                                                onClick={() => navigate("/groups")}
                                                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                        >
                                                Groups
                                        </MuiLink>
                                        <Typography variant="body2" color="text.primary">{group.groupName}</Typography>
                                </Breadcrumbs>

                                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                                        <IconButton onClick={() => navigate("/groups")} sx={{ borderRadius: 1, bgcolor: "action.hover", border: '1px solid', borderColor: 'divider' }}>
                                                <ArrowBackIcon color="primary" />
                                        </IconButton>
                                        <Box>
                                                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1.5px' }} className="text-gradient">
                                                        {group.groupName}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                                        Corporate-grade expense management
                                                </Typography>
                                        </Box>
                                </Stack>
                        </motion.div>

                        <Grid container spacing={4}>
                                <Grid item xs={12} lg={9}>
                                        <Paper className="glass-effect" sx={{ borderRadius: 1, overflow: "hidden", mb: 4, border: '1px solid', borderColor: 'divider' }}>
                                                <Tabs
                                                        value={tabIndex}
                                                        onChange={handleTabChange}
                                                        variant="fullWidth"
                                                        textColor="primary"
                                                        indicatorColor="primary"
                                                        sx={{
                                                                borderBottom: 1,
                                                                borderColor: "divider",
                                                                "& .MuiTab-root": { py: 3, fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'text.secondary' },
                                                                "& .Mui-selected": { color: 'primary.main' },
                                                        }}
                                                >
                                                        <Tab icon={<ReceiptLongIcon />} iconPosition="start" label="Expenses" />
                                                        <Tab icon={<PeopleIcon />} iconPosition="start" label="Members" />
                                                        <Tab icon={<AccountBalanceWalletIcon />} iconPosition="start" label="Balances" />
                                                        <Tab icon={<PaymentIcon />} iconPosition="start" label="Payments" />
                                                </Tabs>

                                                <Box sx={{ p: { xs: 3, md: 5 } }}>
                                                        <AnimatePresence mode="wait">
                                                                <motion.div
                                                                        key={tabIndex}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -10 }}
                                                                        transition={{ duration: 0.3 }}
                                                                >
                                                                        {tabIndex === 0 && <ExpensesTab group={group} onAddExpense={handleExpenseAdded} />}
                                                                        {tabIndex === 1 && <MembersTab group={group} onAddMember={onAddMember} />}
                                                                        {tabIndex === 2 && <BalancesTab group={group} />}
                                                                        {tabIndex === 3 && <PaymentsTab group={group} onAddPayment={refreshGroups} />}
                                                                </motion.div>
                                                        </AnimatePresence>
                                                </Box>
                                        </Paper>

                                        <AnalyticsDashboard groupId={group.groupId} expenses={group.expenses || []} />
                                </Grid>

                                <Grid item xs={12} lg={3}>
                                        <Paper className="glass-effect" sx={{ p: 4, borderRadius: 1, border: '1px solid', borderColor: 'divider', height: 'fit-content' }}>
                                                <ActivityFeed groupId={group.groupId} refreshTrigger={refreshTrigger} />
                                        </Paper>
                                </Grid>
                        </Grid>
                </Container>
        );
}