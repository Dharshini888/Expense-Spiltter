package com.examly.springapp.repository;

import com.examly.springapp.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByGroupName(String groupName);
    List<Group> findByOwner_Id(Long ownerId);
    List<Group> findByGroupNameContainingIgnoreCase(String groupName);
    List<Group> findByOwner_IdAndGroupNameContainingIgnoreCase(Long ownerId, String groupName);
}