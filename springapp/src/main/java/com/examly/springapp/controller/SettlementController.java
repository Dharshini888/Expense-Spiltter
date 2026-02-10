package com.examly.springapp.controller;

import com.examly.springapp.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/groups/{groupId}/settlements")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @GetMapping("/optimize")
    public ResponseEntity<List<Map<String, Object>>> optimizeSettlements(@PathVariable Long groupId) {
        List<Map<String, Object>> settlements = settlementService.simplifyDebts(groupId);
        return ResponseEntity.ok(settlements);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@PathVariable Long groupId, @RequestParam String userName) {
        List<String> suggestions = settlementService.getSmartSuggestions(groupId, userName);
        return ResponseEntity.ok(suggestions);
    }
}
