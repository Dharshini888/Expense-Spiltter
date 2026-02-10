package com.examly.springapp.repository;

import com.examly.springapp.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByGroup_GroupIdOrderByCreatedAtDesc(Long groupId);
}
