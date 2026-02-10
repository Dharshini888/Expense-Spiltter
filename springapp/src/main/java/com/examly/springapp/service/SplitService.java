package com.examly.springapp.service;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class SplitService {

    @Autowired
    private ExpenseSplitRepository splitRepo;

    @Autowired
    private MemberRepository memberRepo;

    public void createSplits(Expense expense, List<Map<String, Object>> splitData) {
        switch (expense.getSplitType()) {
            case EQUAL:
                createEqualSplits(expense);
                break;
            case EXACT:
                createExactSplits(expense, splitData);
                break;
            case PERCENT:
                createPercentageSplits(expense, splitData);
                break;
            case SHARE:
                createShareSplits(expense, splitData);
                break;
        }
    }

    private void createEqualSplits(Expense expense) {
        List<Member> members = expense.getGroup().getMembers();
        if (members.isEmpty()) return;

        double share = expense.getAmount() / members.size();
        saveSplits(expense, members, null, share);
    }

    private void createExactSplits(Expense expense, List<Map<String, Object>> splitData) {
        for (Map<String, Object> data : splitData) {
            Long memberId = Long.valueOf(data.get("memberId").toString());
            double amount = Double.parseDouble(data.get("amount").toString());
            Member member = memberRepo.findById(memberId).orElseThrow();
            saveSingleSplit(expense, member, amount, amount);
        }
    }

    private void createPercentageSplits(Expense expense, List<Map<String, Object>> splitData) {
        for (Map<String, Object> data : splitData) {
            Long memberId = Long.valueOf(data.get("memberId").toString());
            double percent = Double.parseDouble(data.get("percent").toString());
            double amount = (expense.getAmount() * percent) / 100.0;
            Member member = memberRepo.findById(memberId).orElseThrow();
            saveSingleSplit(expense, member, percent, amount);
        }
    }

    private void createShareSplits(Expense expense, List<Map<String, Object>> splitData) {
        double totalShares = splitData.stream()
                .mapToDouble(d -> Double.parseDouble(d.get("shares").toString()))
                .sum();

        for (Map<String, Object> data : splitData) {
            Long memberId = Long.valueOf(data.get("memberId").toString());
            double shares = Double.parseDouble(data.get("shares").toString());
            double amount = (expense.getAmount() * shares) / totalShares;
            Member member = memberRepo.findById(memberId).orElseThrow();
            saveSingleSplit(expense, member, shares, amount);
        }
    }

    private void saveSplits(Expense expense, List<Member> members, Double splitValue, double amount) {
        for (Member m : members) {
            saveSingleSplit(expense, m, splitValue, amount);
        }
    }

    private void saveSingleSplit(Expense expense, Member member, Double splitValue, double amount) {
        ExpenseSplit s = new ExpenseSplit();
        s.setExpense(expense);
        s.setParticipant(member);
        s.setAmountOwed(Math.round(amount * 100.0) / 100.0);
        s.setSplitValue(splitValue);
        // If the participant is the payer, mark as settled (simplified logic)
        if (member.getName().equalsIgnoreCase(expense.getPayer())) {
            s.setSettled(true);
        }
        splitRepo.save(s);
    }
}