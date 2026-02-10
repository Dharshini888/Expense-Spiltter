// package com.examly.springapp.service;

// import com.examly.springapp.model.Payment;

// import com.examly.springapp.model.Group;

// import com.examly.springapp.repository.PaymentRepository;

// import com.examly.springapp.repository.GroupRepository;

// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service

// public class PaymentService {

//     @Autowired

//     private PaymentRepository paymentRepository;

//     @Autowired

//     private GroupRepository groupRepository;

//     // ✅ Record a repayment

//     public Payment addPayment(Long groupId, String payer, String receiver, double amount) {

//         Group group = groupRepository.findById(groupId)

//                 .orElseThrow(() -> new RuntimeException("Group not found"));

//         Payment payment = new Payment(group, payer, receiver, amount);

//         return paymentRepository.save(payment);

//     }

//     // ✅ Get all payments for a group

//     public List<Payment> getPaymentsByGroup(Long groupId) {

//         return paymentRepository.findByGroup_GroupId(groupId);

//     }

// }

package com.examly.springapp.service;

import com.examly.springapp.model.*;

import com.examly.springapp.repository.*;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.*;

@Service

public class PaymentService {

    @Autowired

    private PaymentRepository paymentRepository;

    @Autowired

    private ExpenseRepository expenseRepository;

    @Autowired

    private GroupRepository groupRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ExpenseSplitRepository splitRepository;

    @Autowired
    private ActivityService activityService;

    // ✅ Add a payment with partial payment support and validation
    public Payment addPayment(Long groupId, String payer, String receiver, double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");

        List<Map<String, Object>> currentSettlements = calculateSettlements(groupId);
        boolean owesMoney = false;
        double maxOwed = 0;

        for (Map<String, Object> s : currentSettlements) {
            if (s.get("from").toString().equalsIgnoreCase(payer) && s.get("to").toString().equalsIgnoreCase(receiver)) {
                owesMoney = true;
                maxOwed = (Double) s.get("amount");
                break;
            }
        }

        if (!owesMoney) {
            throw new IllegalArgumentException(payer + " does not owe money to " + receiver);
        }
        
        if (amount > maxOwed + 0.01) {
            throw new IllegalArgumentException(payer + " only owes ₹" + maxOwed + " to " + receiver + ". Cannot pay more.");
        }

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Payment payment = new Payment();
        payment.setGroup(group);
        payment.setPayer(payer);
        payment.setReceiver(receiver);
        payment.setAmount(amount);
        payment.setDate(java.time.LocalDate.now());

        // Allocate payment to unpaid splits
        List<ExpenseSplit> unpaidSplits = splitRepository.findByExpense_Group_GroupId(groupId);
        double remaining = amount;

        for (ExpenseSplit split : unpaidSplits) {
            if (remaining <= 0) break;
            
            if (split.getParticipant().getName().equalsIgnoreCase(payer) && 
                split.getExpense().getPayer().equalsIgnoreCase(receiver) && 
                !split.isSettled()) {
                
                double owed = split.getAmountOwed() - split.getPaidAmount();
                double paymentToApply = Math.min(remaining, owed);
                
                split.setPaidAmount(split.getPaidAmount() + paymentToApply);
                if (split.getPaidAmount() >= split.getAmountOwed() - 0.01) {
                    split.setSettled(true);
                    split.setSettledAt(java.time.OffsetDateTime.now());
                }
                splitRepository.save(split);
                remaining -= paymentToApply;
            }
        }

        Payment saved = paymentRepository.save(payment);
        activityService.logActivity(groupId, payer + " paid ₹" + amount + " to " + receiver);
        return saved;
    }

    // ✅ Get all payments for a group

    public List<Payment> getPaymentsByGroup(Long groupId) {

        return paymentRepository.findByGroup_GroupId(groupId);

    }

    // ✅ Calculate settlements (who owes whom)

    public List<Map<String, Object>> calculateSettlements(Long groupId) {

        Group group = groupRepository.findById(groupId)

                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Member> members = group.getMembers();

        List<Expense> expenses = expenseRepository.findByGroup_GroupId(groupId);

        List<Payment> payments = paymentRepository.findByGroup_GroupId(groupId);

        if (members.isEmpty()) {

            throw new RuntimeException("No members in the group");

        }

        // 1. Calculate total paid per member

        Map<String, Double> paidMap = new HashMap<>();

        for (Member m : members) {

            paidMap.put(m.getName(), 0.0);

        }

        for (Expense expense : expenses) {

            paidMap.put(expense.getPayer(),

                    paidMap.get(expense.getPayer()) + expense.getAmount());

        }

        // 2. Each member’s fair share

        double totalExpense = expenses.stream()

                .mapToDouble(Expense::getAmount)

                .sum();

        double share = (members.isEmpty()) ? 0 : totalExpense / members.size();

        // 3. Initial balances = paid - share

        Map<String, Double> balanceMap = new HashMap<>();

        for (Member m : members) {

            double balance = paidMap.get(m.getName()) - share;

            balanceMap.put(m.getName(), balance);

        }

        // 4. Apply payments

        for (Payment payment : payments) {

            balanceMap.put(payment.getPayer(),

                    balanceMap.getOrDefault(payment.getPayer(), 0.0) - payment.getAmount());

            balanceMap.put(payment.getReceiver(),

                    balanceMap.getOrDefault(payment.getReceiver(), 0.0) + payment.getAmount());

        }

        // 5. Prepare settlements

        List<Map<String, Object>> settlements = new ArrayList<>();

        List<Map.Entry<String, Double>> creditors = new ArrayList<>();

        List<Map.Entry<String, Double>> debtors = new ArrayList<>();

        for (Map.Entry<String, Double> entry : balanceMap.entrySet()) {

            if (entry.getValue() > 0.01) {

                creditors.add(entry); // is owed money

            } else if (entry.getValue() < -0.01) {

                debtors.add(entry); // owes money

            }

        }

        int i = 0, j = 0;

        while (i < debtors.size() && j < creditors.size()) {

            String debtor = debtors.get(i).getKey();

            String creditor = creditors.get(j).getKey();

            double debt = -debtors.get(i).getValue(); // positive

            double credit = creditors.get(j).getValue();

            double settledAmount = Math.min(debt, credit);

            if (settledAmount > 0) {

                Map<String, Object> settlement = new HashMap<>();

                settlement.put("from", debtor);

                settlement.put("to", creditor);

                settlement.put("amount", Math.round(settledAmount * 100.0) / 100.0);

                settlements.add(settlement);

                // Update balances

                debtors.get(i).setValue(-(debt - settledAmount));

                creditors.get(j).setValue(credit - settledAmount);

            }

            if (Math.abs(debtors.get(i).getValue()) < 0.01)
                i++;

            if (Math.abs(creditors.get(j).getValue()) < 0.01)
                j++;

        }

        return settlements;

    }

}
