package com.examly.springapp.service;

import com.examly.springapp.model.Group;

import com.examly.springapp.model.Member;

import com.examly.springapp.repository.GroupRepository;

import com.examly.springapp.repository.MemberRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class MemberService {

    @Autowired

    private MemberRepository memberRepository;

    @Autowired

    private GroupRepository groupRepository;

    public Member addMember(Long groupId, String memberName) {

        Group group = groupRepository.findById(groupId)

                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (memberRepository.findByNameAndGroup_GroupName(memberName, group.getGroupName()).isPresent()) {

            throw new IllegalArgumentException("Member already exists in group");

        }

        Member member = new Member();

        member.setName(memberName);

        member.setGroup(group);

        return memberRepository.save(member);

    }

    public List<Member> getMembersByGroup(Long groupId) {

        return memberRepository.findByGroup_GroupId(groupId);

    }

}