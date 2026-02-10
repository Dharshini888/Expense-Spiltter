package com.examly.springapp.service;

import com.examly.springapp.model.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SettlementService {

    @Autowired
    private ExpenseService expenseService;

    public List<Map<String, Object>> simplifyDebts(Long groupId) {
        List<Map<String, Object>> userBalances = expenseService.calculateBalances(groupId);
        
        List<BalanceNode> debtors = new ArrayList<>();
        List<BalanceNode> creditors = new ArrayList<>();

        for (Map<String, Object> entry : userBalances) {
            String name = (String) entry.get("member");
            double balance = (Double) entry.get("balance");

            if (balance < -0.01) {
                debtors.add(new BalanceNode(name, -balance));
            } else if (balance > 0.01) {
                creditors.add(new BalanceNode(name, balance));
            }
        }

        // Sort to optimize: largest debtor with largest creditor
        debtors.sort((a, b) -> Double.compare(b.amount, a.amount));
        creditors.sort((a, b) -> Double.compare(b.amount, a.amount));

        List<Map<String, Object>> transactions = new ArrayList<>();
        
        int d = 0, c = 0;
        while (d < debtors.size() && c < creditors.size()) {
            BalanceNode debtor = debtors.get(d);
            BalanceNode creditor = creditors.get(c);

            double settlementAmount = Math.min(debtor.amount, creditor.amount);
            
            if (settlementAmount > 0.01) {
                Map<String, Object> transaction = new HashMap<>();
                transaction.put("from", debtor.name);
                transaction.put("to", creditor.name);
                transaction.put("amount", Math.round(settlementAmount * 100.0) / 100.0);
                transactions.add(transaction);
            }

            debtor.amount -= settlementAmount;
            creditor.amount -= settlementAmount;

            if (debtor.amount <= 0.01) d++;
            if (creditor.amount <= 0.01) c++;
        }

        return transactions;
    }

    public List<String> getSmartSuggestions(Long groupId, String userName) {
        List<Map<String, Object>> simplified = simplifyDebts(groupId);
        List<String> suggestions = new ArrayList<>();

        for (Map<String, Object> t : simplified) {
            String from = (String) t.get("from");
            String to = (String) t.get("to");
            double amount = (Double) t.get("amount");

            if (from.equalsIgnoreCase(userName)) {
                suggestions.add("Pay ₹" + amount + " to " + to + " to clear most of your debt.");
            }
        }

        if (suggestions.isEmpty()) {
            suggestions.add("You are all settled up! No optimized payments suggested.");
        }

        return suggestions;
    }

    private static class BalanceNode {
        String name;
        double amount;

        BalanceNode(String name, double amount) {
            this.name = name;
            this.amount = amount;
        }
    }
}
