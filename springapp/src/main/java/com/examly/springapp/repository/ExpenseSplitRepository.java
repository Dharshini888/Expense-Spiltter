package com.examly.springapp.repository;

import com.examly.springapp.model.*;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {

        List<ExpenseSplit> findByExpense_Group_GroupId(Long groupId);

        List<ExpenseSplit> findByExpense(Expense expense);

        List<ExpenseSplit> findByParticipantAndSettled(Member participant, boolean settled);

}