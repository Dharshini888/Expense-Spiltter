package com.examly.springapp.controller;

import com.examly.springapp.model.Member;

import com.examly.springapp.service.MemberService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController

@RequestMapping("/members")

public class MemberController {

    @Autowired

    private MemberService memberService;

    @PostMapping
    public ResponseEntity<?> addMember(@RequestBody Map<String, Object> request) {

        try {

            Long groupId = Long.parseLong(request.get("groupId").toString());

            String memberName = request.get("name").toString();

            Member member = memberService.addMember(groupId, memberName);
            return ResponseEntity.ok(member);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }

    @GetMapping("/group/{groupId}")

    public ResponseEntity<?> getMembersByGroup(@PathVariable Long groupId) {

        try {

            List<Member> members = memberService.getMembersByGroup(groupId);

            return ResponseEntity.ok(members);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }

}
