package com.securetrack.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Request body for the "Manage Users" use case - creates Staff, Driver or Owner accounts. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    /** One of: ADMIN, CUSTOM_OFFICER, INSPECTOR, DRIVER, OWNER */
    @NotBlank
    private String accountType;

    /** Required only when accountType = DRIVER */
    private String vehicleNo;
}
