package com.examly.springapp.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity

public class Payment {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long paymentId;

    @ManyToOne

    @JoinColumn(name = "group_id", nullable = false)

    private Group group;

    private String payer;

    private String receiver;

    private double amount;

    private LocalDate date = LocalDate.now();

    public Payment() {
    }

    public Payment(Group group, String payer, String receiver, double amount) {

        this.group = group;

        this.payer = payer;

        this.receiver = receiver;

        this.amount = amount;

    }

    // Getters and setters

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

}
