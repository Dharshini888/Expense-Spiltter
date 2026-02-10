
package com.examly.springapp.controller;

import com.examly.springapp.model.User;

import com.examly.springapp.repository.UserRepository;

import com.examly.springapp.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController

@RequestMapping("/auth")

@CrossOrigin(origins = "*")

public class AuthController {

    @GetMapping("/login-test")
    public String loginTest() {
        return "Auth controller is reachable";
    }

    @Autowired

    private UserRepository userRepository;

    private final UserService userService;

    public AuthController(UserService userService) {

        this.userService = userService;

    }

    // Registration endpoint

    @PostMapping("/register")

    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            User saved = userService.register(user);

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));

        }

    }

    // Login endpoint

    @PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody User request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (userService.checkPassword(user, request.getPasswordHash())) {

                return ResponseEntity.ok(new LoginResponse("dummy-token-123", user.getId(), user.getName(), user.getRole()));

            }

        }

        return ResponseEntity.status(401).body(new ErrorResponse("Invalid credentials"));

    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        // Simple mock: for any token, return a dummy user or find by name if possible
        // In a real app, you'd parse JWT here.
        // For now, let's just return the first user or 401 if no token.
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not logged in"));
        }
        
        Optional<User> userOpt = userRepository.findAll().stream().findFirst();
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getName(), user.getRole()));
        }
        
        return ResponseEntity.status(401).body(new ErrorResponse("No users found"));
    }

    // Response records

    public record LoginResponse(String token, Long id, String name, String role) {
    }

    public record UserResponse(Long id, String name, String role) {
    }

    public record ErrorResponse(String error) {
    }

}