// package com.examly.springapp.controller;

// import com.examly.springapp.model.Group;
// import com.examly.springapp.model.Member;
// import com.examly.springapp.repository.GroupRepository;
// import com.examly.springapp.service.GroupService;

// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.http.*;

// import org.springframework.web.bind.annotation.*;

// import java.util.*;

// @RestController
// @RequestMapping("/groups")

// public class GroupController {

//     @Autowired

//     private GroupService groupService;

//     @Autowired

//     private GroupRepository groupRepository;

//     // @GetMapping("/{id}")

//     // public ResponseEntity<?> getGroupById(@PathVariable Long id) {

//     // Optional<Group> groupOpt = groupService.getGroupById(id);

//     // if (groupOpt.isEmpty()) {

//     // Map<String, String> error = new HashMap<>();

//     // error.put("error", "Group not found");

//     // return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);

//     // }

//     // Group g = groupOpt.get();

//     // Map<String, Object> groupMap = new LinkedHashMap<>();

//     // groupMap.put("groupId", g.getGroupId());

//     // groupMap.put("groupName", g.getGroupName());

//     // groupMap.put("members", g.getMembers()); // ensures it’s an array in JSON

//     // return ResponseEntity.ok(groupMap);

//     // }

//     @GetMapping("/{id}")

//     public ResponseEntity<?> getGroupById(@PathVariable Long id) {

//         Optional<Group> groupOpt = groupService.getGroupById(id);

//         if (groupOpt.isEmpty()) {

//             return ResponseEntity.status(HttpStatus.NOT_FOUND)

//                     .body(Map.of("error", "Group not found"));

//         }

//         Group g = groupOpt.get();

//         Map<String, Object> groupMap = new LinkedHashMap<>();

//         groupMap.put("groupId", g.getGroupId());

//         groupMap.put("groupName", g.getGroupName());

//         // ✅ Return only member names

//         List<String> memberNames = g.getMembers().stream()

//                 .map(Member::getName)

//                 .toList();

//         groupMap.put("members", memberNames);

//         return ResponseEntity.ok(groupMap);

//     }

//     @PostMapping

//     public ResponseEntity<?> createGroup(@RequestBody Map<String, Object> request) {

//         try {

//             String groupName = (String) request.get("groupName");

//             Object membersRaw = request.get("members");

//             List<String> members = new ArrayList<>();

//             if (membersRaw instanceof List<?>) {

//                 for (Object obj : (List<?>) membersRaw) {

//                     if (obj instanceof String) {

//                         members.add((String) obj);

//                     } else {

//                         throw new IllegalArgumentException("Each member must be a string.");

//                     }

//                 }

//             } else {

//                 throw new IllegalArgumentException("Members should be a list.");

//             }

//             Group group = groupService.createGroup(groupName, members);

//             // Ensure JSON contains members array and groupId

//             Map<String, Object> response = new LinkedHashMap<>();

//             response.put("groupId", group.getGroupId());

//             response.put("groupName", group.getGroupName());

//             response.put("members", group.getMembers());

//             return new ResponseEntity<>(response, HttpStatus.CREATED);

//         } catch (IllegalArgumentException ex) {

//             return new ResponseEntity<>(Map.of("error", ex.getMessage()),
//                     HttpStatus.BAD_REQUEST);

//         }

//     }

//     @GetMapping

//     public ResponseEntity<List<Map<String, Object>>> getAllGroups() {

//         List<Group> groups = groupService.getAllGroups();

//         List<Map<String, Object>> groupList = new ArrayList<>();

//         for (Group g : groups) {

//             Map<String, Object> groupMap = new LinkedHashMap<>();

//             groupMap.put("groupId", g.getGroupId());

//             groupMap.put("groupName", g.getGroupName());

//             // Convert members to list of names

//             List<String> memberNames = g.getMembers().stream()

//                     .map(Member::getName)

//                     .toList();

//             groupMap.put("members", memberNames);

//             groupList.add(groupMap);

//         }

//         return ResponseEntity.ok(groupList);

//     }

//     @PostMapping("/add-member")

//     public ResponseEntity<?> addMember(@RequestBody Map<String, String> payload) {

//         try {

//             String groupName = payload.get("groupName");

//             String memberName = payload.get("memberName");

//             Group updatedGroup = groupService.addMemberToGroup(groupName, memberName);

//             return ResponseEntity.status(HttpStatus.CREATED).body(updatedGroup);

//         } catch (IllegalArgumentException e) {

//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)

//                     .body(Map.of("error", e.getMessage()));

//         } catch (NoSuchElementException e) {

//             return ResponseEntity.status(HttpStatus.NOT_FOUND)

//                     .body(Map.of("error", e.getMessage()));

//         }

//     }

//     // @GetMapping("/{groupId}/balances")

//     // public Map<String, Object> calculateBalances(@PathVariable Long groupId) {

//     // List<Map<String, Object>> balances =
//     // groupService.calculateGroupBalances(groupId);

//     // return Map.of("balances", balances);

//     // }
//     @GetMapping("/{groupId}/balances")

//     public ResponseEntity<?> calculateBalances(@PathVariable Long groupId) {

//         try {

//             List<Map<String, Object>> balances = groupService.calculateGroupBalances(groupId);

//             return ResponseEntity.ok(Map.of("balances", balances));

//         } catch (NoSuchElementException e) {

//             return ResponseEntity.status(HttpStatus.NOT_FOUND)

//                     .body(Map.of("error", "Group not found"));

//         } catch (Exception e) {

//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

//                     .body(Map.of("error", e.getMessage()));

//         }

//     }

//     @DeleteMapping("/{id}")

//     public ResponseEntity<?> deleteGroup(@PathVariable Long id) {

//         try {

//             groupService.deleteGroup(id);

//             return ResponseEntity.ok(Map.of("message", "Group deleted successfully"));

//         } catch (NoSuchElementException e) {

//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));

//         } catch (Exception e) {

//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));

//         }

//     }

// }

package com.examly.springapp.controller;

import com.examly.springapp.model.Group;

import com.examly.springapp.model.Member;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.GroupRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.GroupService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.*;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/groups")

public class GroupController {

    @Autowired

    private GroupService groupService;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;
    // GET /groups/{id}

    @GetMapping("/{id}")

    public ResponseEntity<?> getGroupById(@PathVariable Long id) {

        return groupService.getGroupById(id)
                .map(group -> {

                    Map<String, Object> map = new LinkedHashMap<>();

                    map.put("groupId", group.getGroupId());

                    map.put("groupName", group.getGroupName());
                    map.put("category", group.getCategory());
                    List<String> memberNames = group.getMembers().stream()
                            .map(Member::getName).toList();
                    map.put("members", memberNames);
                    
                    // Map expenses to avoid circular reference
                    List<Map<String, Object>> expenseList = group.getExpenses().stream()
                            .map(e -> {
                                Map<String, Object> expMap = new LinkedHashMap<>();
                                expMap.put("expenseId", e.getExpenseId());
                                expMap.put("description", e.getDescription());
                                expMap.put("amount", e.getAmount());
                                expMap.put("payer", e.getPayer());
                                expMap.put("date", e.getDate());
                                expMap.put("category", e.getCategory());
                                expMap.put("splitType", e.getSplitType());
                                expMap.put("dueDate", e.getDueDate());
                                expMap.put("attachmentUrl", e.getAttachmentUrl());
                                return expMap;
                            }).toList();
                    map.put("expenses", expenseList);
                    return ResponseEntity.ok(map);

                })

                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)

                        .body(Map.of("error", "Group not found")));

    }

    // POST /groups

    @PostMapping

    public ResponseEntity<?> createGroup(@RequestBody Map<String, Object> request) {

        try {

            String groupName = (String) request.get("groupName");
            String category = (String) request.get("category");
            Object membersRaw = request.get("members");
            List<String> members = new ArrayList<>();

            if (membersRaw instanceof List<?>) {

                for (Object obj : (List<?>) membersRaw) {

                    if (obj instanceof String)
                        members.add((String) obj);

                    else
                        throw new IllegalArgumentException("Each member must be a string.");

                }

            } else
                throw new IllegalArgumentException("Members should be a list.");

            Object ownerIdObj = request.get("ownerId");
            Group group;
            if (ownerIdObj != null) {
                Long ownerId = Long.valueOf(ownerIdObj.toString());
                User owner = userRepository.findById(ownerId).orElse(null);
                if (owner != null) {
                    group = groupService.createGroup(groupName, members, owner, category);
                } else {
                    group = groupService.createGroup(groupName, members);
                    if (category != null) {
                        group.setCategory(category);
                        groupRepository.save(group);
                    }
                }
            } else {
                group = groupService.createGroup(groupName, members);
                if (category != null) {
                    group.setCategory(category);
                    groupRepository.save(group);
                }
            }
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("groupId", group.getGroupId());
            response.put("groupName", group.getGroupName());
            response.put("category", group.getCategory());
            response.put("owner", group.getOwner());
            response.put("members", group.getMembers().stream()
                    .map(Member::getName).toList());
            response.put("expenses", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException ex) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)

                    .body(Map.of("error", ex.getMessage()));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create group: " + ex.getMessage()));
        }

    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllGroups(@RequestParam(required = false) Long ownerId) {
        List<Group> groups = (ownerId != null) ? groupService.getGroupsByOwner(ownerId) : groupService.getAllGroups();
        List<Map<String, Object>> groupList = new ArrayList<>();

        for (Group g : groups) {

            Map<String, Object> groupMap = new LinkedHashMap<>();

            groupMap.put("groupId", g.getGroupId());

            groupMap.put("groupName", g.getGroupName());
            groupMap.put("category", g.getCategory());

            List<String> memberNames = g.getMembers().stream()

                    .map(Member::getName).toList();

            groupMap.put("members", memberNames);
            
            // Map expenses to avoid circular reference
            List<Map<String, Object>> expenseList = g.getExpenses().stream()
                    .map(e -> {
                        Map<String, Object> expMap = new LinkedHashMap<>();
                        expMap.put("expenseId", e.getExpenseId());
                        expMap.put("description", e.getDescription());
                        expMap.put("amount", e.getAmount());
                        expMap.put("payer", e.getPayer());
                        expMap.put("date", e.getDate());
                        expMap.put("category", e.getCategory());
                        expMap.put("splitType", e.getSplitType());
                        expMap.put("dueDate", e.getDueDate());
                        expMap.put("attachmentUrl", e.getAttachmentUrl());
                        return expMap;
                    }).toList();
            groupMap.put("expenses", expenseList);

            groupList.add(groupMap);

        }

        return ResponseEntity.ok(groupList);

    }

    // POST /groups/add-member

    @PostMapping("/add-member")

    public ResponseEntity<?> addMember(@RequestBody Map<String, String> payload) {

        try {

            String groupName = payload.get("groupName");

            String memberName = payload.get("memberName");

            Group updatedGroup = groupService.addMemberToGroup(groupName, memberName);

            Map<String, Object> response = new LinkedHashMap<>();

            response.put("groupId", updatedGroup.getGroupId());

            response.put("groupName", updatedGroup.getGroupName());

            response.put("members", updatedGroup.getMembers().stream()

                    .map(Member::getName).toList());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)

                    .body(Map.of("error", e.getMessage()));

        } catch (NoSuchElementException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)

                    .body(Map.of("error", e.getMessage()));

        }

    }

    // GET /groups/{groupId}/balances

    @GetMapping("/{groupId}/balances")

    public ResponseEntity<?> calculateBalances(@PathVariable Long groupId) {

        try {

            List<Map<String, Object>> balances = groupService.calculateGroupBalances(groupId);

            return ResponseEntity.ok(Map.of("balances", balances));

        } catch (NoSuchElementException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)

                    .body(Map.of("error", "Group not found"));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(Map.of("error", e.getMessage()));

        }

    }

    // DELETE /groups/{id}

    @DeleteMapping("/{id}")

    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {

        try {

            groupService.deleteGroup(id);

            return ResponseEntity.ok(Map.of("message", "Group deleted successfully"));

        } catch (NoSuchElementException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)

                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(Map.of("error", e.getMessage()));

        }

    }

    @GetMapping("/{groupId}/members")

    public ResponseEntity<List<Member>> getGroupMembers(@PathVariable Long groupId) {

        Group group = groupService.getGroupById(groupId) // this probably returns Optional<Group>

                .orElseThrow(() -> new RuntimeException("Group not found"));

        return ResponseEntity.ok(group.getMembers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Group>> searchGroups(@RequestParam String q, @RequestParam(required = false) Long ownerId) {
        return ResponseEntity.ok(groupService.searchGroups(ownerId, q));
    }
}
