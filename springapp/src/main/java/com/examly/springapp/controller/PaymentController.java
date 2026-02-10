package com.examly.springapp.controller;

import com.examly.springapp.model.Payment;

import com.examly.springapp.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/payments")

public class PaymentController {

    @Autowired

    private PaymentService paymentService;

    // ✅ Add a new payment

    @PostMapping("/{groupId}")

    public ResponseEntity<Payment> addPayment(

            @PathVariable Long groupId,

            @RequestBody Map<String, Object> request) {

        String payer = request.get("payer").toString();

        String receiver = request.get("receiver").toString();

        double amount = Double.parseDouble(request.get("amount").toString());

        Payment payment = paymentService.addPayment(groupId, payer, receiver, amount);

        return ResponseEntity.ok(payment);

    }

    // ✅ Get all payments for a group

    @GetMapping("/{groupId}")

    public ResponseEntity<List<Payment>> getPayments(@PathVariable Long groupId) {

        return ResponseEntity.ok(paymentService.getPaymentsByGroup(groupId));

    }

    // ✅ Get simplified settlements

    @GetMapping("/{groupId}/settlements")

    public ResponseEntity<List<Map<String, Object>>> getSettlements(@PathVariable Long groupId) {

            return ResponseEntity.ok(paymentService.calculateSettlements(groupId));

    }

}
