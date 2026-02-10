package com.examly.springapp.service;

import com.examly.springapp.model.User;

import com.examly.springapp.repository.UserRepository;

import org.mindrot.jbcrypt.BCrypt;

import org.springframework.stereotype.Service;

@Service

public class UserService {

    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {

        this.userRepo = userRepo;

    }

    // Register a new user

    public User register(User user) {

        if (userRepo.existsByEmail(user.getEmail())) {

            throw new RuntimeException("Email already registered");

        }

        // Hash the password before saving

        String hashed = BCrypt.hashpw(user.getPasswordHash(), BCrypt.gensalt());

        user.setPasswordHash(hashed);

        return userRepo.save(user);

    }

    // Verify password

    public boolean checkPassword(User user, String rawPassword) {

        return BCrypt.checkpw(rawPassword, user.getPasswordHash());

    }

}