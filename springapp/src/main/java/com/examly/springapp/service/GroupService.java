
// package com.examly.springapp.service;

// import com.examly.springapp.model.*;

// import com.examly.springapp.repository.*;

// import jakarta.transaction.Transactional;

// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.util.*;

// @Service

// public class GroupService {

//     @Autowired

//     private GroupRepository groupRepository;

//     @Autowired

//     private MemberRepository memberRepository;

//     @Autowired

//     private ExpenseRepository expenseRepository;

//     public Group createGroup(String groupName, List<String> members) {

//         if (groupRepository.findByGroupName(groupName).isPresent()) {

//             throw new IllegalArgumentException("Group name already exists"); // updated message

//         }

//         Group group = new Group();

//         group.setGroupName(groupName);

//         // Save group first

//         group = groupRepository.save(group);

//         List<Member> memberEntities = new ArrayList<>();

//         for (String memberName : members) {

//             Member member = new Member();

//             member.setName(memberName);

//             member.setGroup(group);

//             memberEntities.add(member);

//         }

//         memberRepository.saveAll(memberEntities);

//         // Attach members to group before returning

//         group.setMembers(memberEntities);

//         return group;

//     }

//     public Group addMemberToGroup(String groupName, String memberName) {

//         Group group = groupRepository.findByGroupName(groupName)
//                 .orElseThrow(() -> new NoSuchElementException("Group not found"));

//         boolean exists = group.getMembers().stream()

//                 .anyMatch(m -> m.getName().equalsIgnoreCase(memberName));

//         if (exists) {

//             throw new IllegalArgumentException("Member already exists in the group");

//         }
//         Member newMember = new Member();

//         newMember.setName(memberName);

//         newMember.setGroup(group);

//         group.getMembers().add(newMember);

//         return groupRepository.save(group);

//     }

//     public Optional<Group> getGroupByName(String groupName) {

//         return groupRepository.findByGroupName(groupName);

//     }

//     public Group saveGroup(Group group) {

//         return groupRepository.save(group);

//     }

//     public Optional<Group> getGroupById(Long id) {

//         return groupRepository.findById(id);

//     }

//     // public List<Map<String, Object>> calculateGroupBalances(Long groupId) {

//     // Group group = groupRepository.findById(groupId)

//     // .orElseThrow(() -> new IllegalArgumentException("Group not found"));

//     // List<Member> members = group.getMembers();

//     // List<Expense> expenses = group.getExpenses();

//     // Map<String, Double> balanceMap = new HashMap<>();

//     // for (Member member : members) {

//     // balanceMap.put(member.getName(), 0.0);

//     // }

//     // for (Expense expense : expenses) {

//     // double amountPerMember = expense.getAmount() / members.size();

//     // for (Member member : members) {

//     // balanceMap.put(member.getName(), balanceMap.get(member.getName()) -
//     // amountPerMember);

//     // }

//     // balanceMap.put(expense.getPayer(), balanceMap.get(expense.getPayer()) +
//     // expense.getAmount());

//     // }

//     // List<Map<String, Object>> result = new ArrayList<>();

//     // for (Map.Entry<String, Double> entry : balanceMap.entrySet()) {

//     // Map<String, Object> memberBalance = new HashMap<>();

//     // memberBalance.put("member", entry.getKey());

//     // memberBalance.put("balance", Math.round(entry.getValue() * 100.0) / 100.0);

//     // result.add(memberBalance);

//     // }

//     // return result;

//     // }

//     public List<Group> getAllGroups() {

//         return groupRepository.findAll();

//     }

//     @Autowired

//     private ExpenseService expenseService;

//     public List<Map<String, Object>> calculateGroupBalances(Long groupId) {

//         return expenseService.calculateBalances(groupId); // ✅ updated logic with Payments

//     }

//     @Transactional

//     public void deleteGroup(Long groupId) {

//         Group group = groupRepository.findById(groupId)

//                 .orElseThrow(() -> new NoSuchElementException("Group not found"));

//         groupRepository.delete(group); // members & expenses will cascade delete

//     }

// }

package com.examly.springapp.service;

import com.examly.springapp.model.*;

import com.examly.springapp.repository.*;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.*;

@Service

public class GroupService {

    @Autowired

    private GroupRepository groupRepository;

    @Autowired

    private MemberRepository memberRepository;

    @Autowired

    private ExpenseRepository expenseRepository;

    @Autowired

    private ExpenseService expenseService;

    public Group createGroup(String groupName, List<String> members) {
        if (groupRepository.findByGroupName(groupName).isPresent())
            throw new IllegalArgumentException("Group name already exists");
        Group group = new Group();
        group.setGroupName(groupName);
        group = groupRepository.save(group);
        List<Member> memberEntities = new ArrayList<>();
        for (String memberName : members) {
            Member member = new Member();
            member.setName(memberName);
            member.setGroup(group);
            memberEntities.add(member);
        }
        memberRepository.saveAll(memberEntities);
        group.setMembers(memberEntities);
        return group;
    }

    public Group createGroup(String groupName, List<String> members, User owner, String category) {
        if (groupRepository.findByGroupName(groupName).isPresent())
            throw new IllegalArgumentException("Group name already exists");
        Group group = new Group();
        group.setGroupName(groupName);
        group.setOwner(owner);
        group.setCategory(category);
        group = groupRepository.save(group);
        List<Member> memberEntities = new ArrayList<>();
        
        // Add owner as First Member (ADMIN)
        if (owner != null) {
            Member ownerMember = new Member(owner.getName(), group, Role.ADMIN);
            memberEntities.add(ownerMember);
        }

        for (String memberName : members) {
            if (owner != null && memberName.equalsIgnoreCase(owner.getName())) continue;
            Member member = new Member();
            member.setName(memberName);
            member.setGroup(group);
            member.setRole(Role.MEMBER);
            memberEntities.add(member);
        }
        memberRepository.saveAll(memberEntities);
        group.setMembers(memberEntities);
        return group;
    }

    public Group addMemberToGroup(String groupName, String memberName) {

        Group group = groupRepository.findByGroupName(groupName)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        boolean exists = group.getMembers().stream()

                .anyMatch(m -> m.getName().equalsIgnoreCase(memberName));

        if (exists)
            throw new IllegalArgumentException("Member already exists in the group");

        Member newMember = new Member();

        newMember.setName(memberName);

        newMember.setGroup(group);

        memberRepository.save(newMember);

        group.getMembers().add(newMember);

        return groupRepository.save(group);

    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public List<Group> getGroupsByOwner(Long ownerId) {
        return groupRepository.findByOwner_Id(ownerId);
    }

    public List<Group> searchGroups(Long ownerId, String query) {
        if (ownerId == null) {
            return groupRepository.findByGroupNameContainingIgnoreCase(query);
        }
        return groupRepository.findByOwner_IdAndGroupNameContainingIgnoreCase(ownerId, query);
    }

    public List<Map<String, Object>> calculateGroupBalances(Long groupId) {

        return expenseService.calculateBalances(groupId);

    }

    // @Transactional

    // public void deleteGroup(Long groupId) {

    // Group group = groupRepository.findById(groupId)

    // .orElseThrow(() -> new NoSuchElementException("Group not found"));

    // groupRepository.delete(group); // cascade deletes members & expenses

    // }

    @Transactional

    public void deleteGroup(Long groupId) {

        Group group = groupRepository.findById(groupId)

                .orElseThrow(() -> new NoSuchElementException("Group not found"));

        group.getMembers().size(); // force load members

        group.getExpenses().size(); // force load expenses

        groupRepository.delete(group);

    }

    public Optional<Group> getGroupById(Long groupId) {

        return groupRepository.findById(groupId);

    }
}
