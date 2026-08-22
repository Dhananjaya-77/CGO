package com.securetrack.backend.controller;

import com.securetrack.backend.dto.LoginRequest;
import com.securetrack.backend.dto.LoginResponse;
import com.securetrack.backend.dto.UserCreateRequest;
import com.securetrack.backend.service.AuthService;
import com.securetrack.backend.service.UserManagementService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - open (/auth/**) endpoints used for authentication.
 * Serves Staff, Driver and Owner logins uniformly, returning a signed JWT.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserManagementService userManagementService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                                HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.login(request, httpRequest));
    }
    
    // තාවකාලිකව Admin කෙනෙක්ව System එක හරහාම Create කරගැනීමට අලුතින් දැමූ කොටස
    @PostMapping("/setup-admin")
    public ResponseEntity<Object> setupAdmin(@RequestBody UserCreateRequest request) {
        Object created = userManagementService.createUser(request);
        return ResponseEntity.status(201).body(created);
    }
}