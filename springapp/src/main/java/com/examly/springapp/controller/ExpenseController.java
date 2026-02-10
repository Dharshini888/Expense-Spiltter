package com.examly.springapp.controller;

import com.examly.springapp.model.Expense;
import com.examly.springapp.model.SplitType;
import com.examly.springapp.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/groups/{groupId}/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<?> addExpense(@PathVariable Long groupId, @RequestBody Map<String, Object> payload) {
        try {
            String description = (String) payload.get("description");
            double amount = Double.parseDouble(payload.get("amount").toString());
            String payer = (String) payload.get("payer");
            LocalDate date = payload.containsKey("date") ? LocalDate.parse(payload.get("date").toString()) : LocalDate.now();
            
            String category = (String) payload.get("category");
            String splitTypeStr = (String) payload.get("splitType");
            SplitType splitType = splitTypeStr != null ? SplitType.valueOf(splitTypeStr.toUpperCase()) : SplitType.EQUAL;
            
            LocalDate dueDate = payload.containsKey("dueDate") && payload.get("dueDate") != null 
                              ? LocalDate.parse(payload.get("dueDate").toString()) : null;
            String attachmentUrl = (String) payload.get("attachmentUrl");
            
            List<Map<String, Object>> splitData = (List<Map<String, Object>>) payload.get("splits");
            if (splitData == null) splitData = new ArrayList<>();

            Expense expense = expenseService.addExpense(groupId, description, amount, payer, date, 
                                                       category, splitType, dueDate, attachmentUrl, splitData);
            return ResponseEntity.status(HttpStatus.CREATED).body(expense);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/balances")
    public ResponseEntity<Map<String, Object>> getGroupBalances(@PathVariable Long groupId) {
        List<Map<String, Object>> balances = expenseService.calculateBalances(groupId);
        Map<String, Object> response = new HashMap<>();
        response.put("balances", balances);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<Expense> getExpenses(@PathVariable Long groupId) {
        return expenseService.getExpensesByGroup(groupId);
    }

    @GetMapping("/search")
    public List<Expense> searchExpenses(@PathVariable Long groupId, @RequestParam String q) {
        return expenseService.searchExpenses(groupId, q);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long groupId, @PathVariable Long expenseId) {
        try {
            expenseService.deleteExpense(expenseId);
            return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete expense: " + e.getMessage()));
        }
    }
}
