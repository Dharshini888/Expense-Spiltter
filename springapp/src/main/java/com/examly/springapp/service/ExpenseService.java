package com.examly.springapp.service;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ExpenseSplitRepository splitRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SplitService splitService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MemberRepository memberRepository;

    @Transactional
    public Expense addExpense(Long groupId, String description, double amount, String payer,
                             LocalDate date, String category, SplitType splitType,
                             LocalDate dueDate, String attachmentUrl, List<Map<String, Object>> splitData) {

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be a positive number");
        }

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        boolean payerExists = group.getMembers().stream()
                .anyMatch(m -> m.getName().equalsIgnoreCase(payer));

        if (!payerExists) {
            throw new NoSuchElementException("Payer not found in group");
        }

        Expense expense = new Expense();
        expense.setDescription(description);
        expense.setAmount(amount);
        expense.setPayer(payer);
        expense.setGroup(group);
        expense.setDate(date != null ? date : LocalDate.now());
        expense.setCategory(category);
        expense.setSplitType(splitType != null ? splitType : SplitType.EQUAL);
        expense.setDueDate(dueDate);
        expense.setAttachmentUrl(attachmentUrl);

        Expense savedExpense = expenseRepository.save(expense);

        // Handle splits
        splitService.createSplits(savedExpense, splitData);
        activityService.logActivity(groupId, payer + " added an expense: " + description);
        
        // Notify members
        List<Member> members = memberRepository.findByGroup_GroupId(groupId);
        for (Member m : members) {
            if (!m.getName().equalsIgnoreCase(payer)) {
                notificationService.sendNotification(m.getMemberId(), payer + " added a new expense: " + description);
            }
        }

        return savedExpense;
    }

    public Expense addExpense(Long groupId, String description, double amount, String payerName, LocalDate date) {
        return addExpense(groupId, description, amount, payerName, date, "General", SplitType.EQUAL, null, null, null);
    }

    public List<Map<String, Object>> calculateBalances(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Member> members = group.getMembers();
        List<Expense> expenses = expenseRepository.findByGroup_GroupId(groupId);
        List<ExpenseSplit> splits = splitRepository.findByExpense_Group_GroupId(groupId);
        List<Payment> payments = paymentRepository.findByGroup_GroupId(groupId);

        Map<String, Double> balanceMap = new HashMap<>();
        for (Member m : members) {
            balanceMap.put(m.getName(), 0.0);
        }

        // 1. Add amount paid by payers
        for (Expense expense : expenses) {
            String payer = expense.getPayer();
            balanceMap.put(payer, balanceMap.getOrDefault(payer, 0.0) + expense.getAmount());
        }

        // 2. Subtract amount owed by participants (from splits)
        for (ExpenseSplit split : splits) {
            String participant = split.getParticipant().getName();
            balanceMap.put(participant, balanceMap.getOrDefault(participant, 0.0) - split.getAmountOwed());
        }

        // 3. Adjust for payments
        for (Payment payment : payments) {
            String payer = payment.getPayer();
            String receiver = payment.getReceiver();
            double amount = payment.getAmount();

            balanceMap.put(payer, balanceMap.getOrDefault(payer, 0.0) + amount);
            balanceMap.put(receiver, balanceMap.getOrDefault(receiver, 0.0) - amount);
        }

        List<Map<String, Object>> balances = new ArrayList<>();
        for (Member m : members) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("member", m.getName());
            entry.put("balance", Math.round(balanceMap.get(m.getName()) * 100.0) / 100.0);
            balances.add(entry);
        }

        return balances;
    }

    public Expense updateExpense(Long expenseId, String description, double amount, String category, LocalDate dueDate) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NoSuchElementException("Expense not found"));

        StringBuilder auditMsg = new StringBuilder("Updated expense '" + expense.getDescription() + "': ");
        boolean changed = false;

        if (!expense.getDescription().equals(description)) {
            auditMsg.append("Desc '").append(expense.getDescription()).append("' -> '").append(description).append("'; ");
            expense.setDescription(description);
            changed = true;
        }
        if (expense.getAmount() != amount) {
            auditMsg.append("Amount ").append(expense.getAmount()).append(" -> ").append(amount).append("; ");
            expense.setAmount(amount);
            changed = true;
        }
        if (!expense.getCategory().equals(category)) {
            auditMsg.append("Category '").append(expense.getCategory()).append("' -> '").append(category).append("'; ");
            expense.setCategory(category);
            changed = true;
        }

        if (changed) {
            Expense updated = expenseRepository.save(expense);
            activityService.logActivity(expense.getGroup().getGroupId(), auditMsg.toString());
            return updated;
        }
        return expense;
    }

    public List<Expense> getExpensesByGroup(Long groupId) {
        return expenseRepository.findByGroup_GroupId(groupId);
    }

    public List<Expense> searchExpenses(Long groupId, String query) {
        return expenseRepository.findByGroup_GroupIdAndDescriptionContainingIgnoreCase(groupId, query);
    }

    @Transactional
    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NoSuchElementException("Expense not found"));
        expenseRepository.delete(expense);
    }
}
