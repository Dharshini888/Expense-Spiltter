package com.examly.springapp.repository;



import com.examly.springapp.model.Member;

import org.springframework.data.jpa.repository.JpaRepository;



import java.util.List;

import java.util.Optional;



public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByGroup_GroupId(Long groupId);

    Optional<Member> findByNameAndGroup_GroupName(String name, String groupName);

    Optional<Member> findByNameAndGroup_GroupId(String name, Long groupId);
}