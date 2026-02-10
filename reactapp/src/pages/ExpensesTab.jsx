import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { fetchMembers, fetchExpenses, addExpense } from "../utils/api";

export default function ExpensesTab({ group, onAddExpense }) {
    const groupId = group.groupId;
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const loadData = useCallback(async () => {
        try {
            const m = await fetchMembers(groupId);
            const e = await fetchExpenses(groupId);
            setMembers(m || []);
            setExpenses(e || []);
        } catch (err) {
            console.error("Error loading expenses data:", err);
        }
    }, [groupId]);

    useEffect(() => {
        if (groupId) loadData();
    }, [groupId, loadData]);

    const handleAdd = async (gid, expenseData) => {
        // Redundant addExpense removed here.
        // Parent App.js handleAddExpense will handle the API call and fetchAllGroups.
        await onAddExpense?.(gid, expenseData);
        await loadData(); // Refresh local list just in case
    };

    return (
        <Box>
            <AddExpenseForm
                groupId={groupId}
                members={members}
                onAddExpense={handleAdd}
                postAdd={loadData}
            />
            <ExpenseList expenses={expenses} />
        </Box>
    );
}
