package com.examly.springapp.repository;



import com.examly.springapp.model.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface PaymentRepository extends JpaRepository<Payment, Long> {

        List<Payment> findByGroup_GroupId(Long groupId);

}
