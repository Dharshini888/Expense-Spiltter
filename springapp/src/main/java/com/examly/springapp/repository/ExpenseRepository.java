package com.examly.springapp.repository;

import com.examly.springapp.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroup_GroupId(Long groupId);
    List<Expense> findByGroup_GroupIdAndDescriptionContainingIgnoreCase(Long groupId, String description);
}