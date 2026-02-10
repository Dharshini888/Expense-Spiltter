package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private GroupRepository groupRepo;

    @Autowired
    private ExpenseRepository expenseRepo;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ActivityRepository activityRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    @GetMapping("/summary")
    public Map<String, Object> summary(@RequestParam String memberName) {
        double totalOwe = 0, totalOwed = 0;
        List<Map<String, Object>> perGroup = new ArrayList<>();

        for (Group g : groupRepo.findAll()) {
            boolean inGroup = g.getMembers().stream().anyMatch(m -> m.getName().equalsIgnoreCase(memberName));
            if (!inGroup) continue;

            var balances = expenseService.calculateBalances(g.getGroupId());
            double my = balances.stream()
                    .filter(b -> b.get("member").toString().equalsIgnoreCase(memberName))
                    .mapToDouble(b -> ((Number) b.get("balance")).doubleValue())
                    .findFirst().orElse(0);

            if (my < 0) totalOwe += -my;
            else totalOwed += my;

            perGroup.add(Map.of("groupId", g.getGroupId(), "groupName", g.getGroupName(), "balance", my));
        }

        return Map.of("member", memberName,
                "totalOwe", Math.round(totalOwe * 100.0) / 100.0,
                "totalOwed", Math.round(totalOwed * 100.0) / 100.0,
                "groups", perGroup);
    }

    @GetMapping("/groups/{groupId}/activities")
    public List<Activity> getActivities(@PathVariable Long groupId) {
        return activityRepo.findByGroup_GroupIdOrderByCreatedAtDesc(groupId);
    }

    @GetMapping("/members/{memberId}/notifications")
    public List<Notification> getNotifications(@PathVariable Long memberId) {
        return notificationRepo.findByMember_MemberIdOrderByCreatedAtDesc(memberId);
    }

    @GetMapping("/groups/{groupId}/analytics/categories")
    public List<Map<String, Object>> getCategoryBreakdown(@PathVariable Long groupId) {
        List<Expense> expenses = expenseRepo.findByGroup_GroupId(groupId);
        Map<String, Double> breakdown = expenses.stream()
                .filter(e -> e.getCategory() != null)
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));

        List<Map<String, Object>> result = new ArrayList<>();
        breakdown.forEach((cat, amt) -> {
            result.add(Map.of("category", cat, "amount", Math.round(amt * 100.0) / 100.0));
        });
        return result;
    }
}