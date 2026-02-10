package com.examly.springapp;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ExpenseSplitterTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        expenseRepository.deleteAll();
        memberRepository.deleteAll();
        groupRepository.deleteAll();
    }

    // GroupService and GroupController Tests
    @Test
    void repository_createGroupSuccessfully() throws Exception {
        Map<String, Object> groupData = new HashMap<>();
        groupData.put("groupName", "Trip to Goa");
        groupData.put("members", Arrays.asList("Alice", "Bob", "Charlie"));

        mockMvc.perform(post("/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(groupData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.groupName").value("Trip to Goa"))
                .andExpect(jsonPath("$.members").isArray())
                .andExpect(jsonPath("$.members.length()").value(3))
                .andExpect(jsonPath("$.groupId").exists());

        // Verify in database
        Optional<Group> savedGroup = groupRepository.findByGroupName("Trip to Goa");
        assertTrue(savedGroup.isPresent());
        assertEquals(3, savedGroup.get().getMembers().size());
    }

    @Test
    void service_createGroupWithDuplicateName() throws Exception {
        // Create first group
        groupService.createGroup("Duplicate Group", Arrays.asList("Alice"));

        // Try to create group with same name
        Map<String, Object> groupData = new HashMap<>();
        groupData.put("groupName", "Duplicate Group");
        groupData.put("members", Arrays.asList("Bob"));

        mockMvc.perform(post("/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(groupData)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Group name already exists"));
    }

    @Test
    void service_getAllGroups() throws Exception {
        // Create test groups
        groupService.createGroup("Group 1", Arrays.asList("Alice", "Bob"));
        groupService.createGroup("Group 2", Arrays.asList("Charlie", "Dave"));

        mockMvc.perform(get("/groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].groupName").exists())
                .andExpect(jsonPath("$[1].groupName").exists());
    }

    @Test
    void service_getGroupById() throws Exception {
        Group group = groupService.createGroup("Test Group", Arrays.asList("Alice", "Bob"));

        mockMvc.perform(get("/groups/" + group.getGroupId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupName").value("Test Group"))
                .andExpect(jsonPath("$.members.length()").value(2));
    }

    @Test
    void service_addMemberToGroupSuccessfully() throws Exception {
        groupService.createGroup("Test Group", Arrays.asList("Alice"));

        Map<String, String> memberData = new HashMap<>();
        memberData.put("groupName", "Test Group");
        memberData.put("memberName", "Bob");

        mockMvc.perform(post("/groups/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(memberData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.groupName").value("Test Group"))
                .andExpect(jsonPath("$.members.length()").value(2));

        // Verify in database
        Optional<Group> updatedGroup = groupRepository.findByGroupName("Test Group");
        assertTrue(updatedGroup.isPresent());
        assertEquals(2, updatedGroup.get().getMembers().size());
    }

    @Test
    void service_addDuplicateMemberToGroup() throws Exception {
        groupService.createGroup("Test Group", Arrays.asList("Alice"));

        Map<String, String> memberData = new HashMap<>();
        memberData.put("groupName", "Test Group");
        memberData.put("memberName", "Alice"); // Duplicate member

        mockMvc.perform(post("/groups/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(memberData)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Member already exists in the group"));
    }

    @Test
    void repository_addExpenseSuccessfully() throws Exception {
        Group group = groupService.createGroup("Expense Group", Arrays.asList("Alice", "Bob"));

        Map<String, Object> expenseData = new HashMap<>();
        expenseData.put("description", "Dinner");
        expenseData.put("amount", 100.50);
        expenseData.put("payer", "Alice");
        expenseData.put("date", "2023-12-01");

        mockMvc.perform(post("/groups/" + group.getGroupId() + "/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expenseData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("Dinner"))
                .andExpect(jsonPath("$.amount").value(100.50))
                .andExpect(jsonPath("$.payer").value("Alice"))
                .andExpect(jsonPath("$.date").value("2023-12-01"));

        // Verify in database
        List<Expense> expenses = expenseRepository.findByGroup_GroupId(group.getGroupId());
        assertEquals(1, expenses.size());
        assertEquals("Dinner", expenses.get(0).getDescription());
    }

    @Test
    void service_addExpenseWithInvalidAmount() throws Exception {
        Group group = groupService.createGroup("Test Group", Arrays.asList("Alice"));

        Map<String, Object> expenseData = new HashMap<>();
        expenseData.put("description", "Invalid Expense");
        expenseData.put("amount", -50.0); // Negative amount
        expenseData.put("payer", "Alice");
        expenseData.put("date", "2023-12-01");

        mockMvc.perform(post("/groups/" + group.getGroupId() + "/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expenseData)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Amount must be a positive number up to two decimal places"));
    }

    @Test
    void service_getExpensesByGroup() throws Exception {
        Group group = groupService.createGroup("Expense Test Group", Arrays.asList("Alice", "Bob"));
        
        // Add multiple expenses
        expenseService.addExpense(group.getGroupId(), "Lunch", 50.0, "Alice", LocalDate.of(2023, 12, 1));
        expenseService.addExpense(group.getGroupId(), "Dinner", 80.0, "Bob", LocalDate.of(2023, 12, 2));

        mockMvc.perform(get("/groups/" + group.getGroupId() + "/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].description").exists())
                .andExpect(jsonPath("$[1].description").exists());
    }

    @Test
    void service_calculateGroupBalances() throws Exception {
        Group group = groupService.createGroup("Balance Test Group", Arrays.asList("Alice", "Bob", "Charlie"));
        
        // Add expenses where Alice pays 90, Bob pays 60, total 150
        // Each person should owe 50, so Alice is +40, Bob is +10, Charlie is -50
        expenseService.addExpense(group.getGroupId(), "Expense 1", 90.0, "Alice", LocalDate.of(2023, 12, 1));
        expenseService.addExpense(group.getGroupId(), "Expense 2", 60.0, "Bob", LocalDate.of(2023, 12, 2));

        mockMvc.perform(get("/groups/" + group.getGroupId() + "/balances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balances").isArray())
                .andExpect(jsonPath("$.balances.length()").value(3));

        // Verify balance calculation logic
        List<Map<String, Object>> balances = expenseService.calculateBalances(group.getGroupId());
        assertEquals(3, balances.size());
        
        // Find Alice's balance (should be positive since she paid more)
        Optional<Map<String, Object>> aliceBalance = balances.stream()
                .filter(b -> "Alice".equals(b.get("member")))
                .findFirst();
        assertTrue(aliceBalance.isPresent());
        assertEquals(40.0, (Double) aliceBalance.get().get("balance"), 0.01);
    }
}