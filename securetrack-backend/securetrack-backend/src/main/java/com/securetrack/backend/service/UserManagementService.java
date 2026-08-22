package com.securetrack.backend.service;

import com.securetrack.backend.dto.UserCreateRequest;
import com.securetrack.backend.exception.BadRequestException;
import com.securetrack.backend.exception.ResourceNotFoundException;
import com.securetrack.backend.models.*;
import com.securetrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * UserManagementService - backs the "Manage Users" use case (Admin-only).
 * Creates/updates/deactivates Staff (Admin/CustomOfficer/Inspector), Driver
 * and Owner accounts.
 */
@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final StaffRepository staffRepository;
    private final AdminRepository adminRepository;
    private final CustomOfficerRepository customOfficerRepository;
    private final InspectorRepository inspectorRepository;
    private final DriverRepository driverRepository;
    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Object createUser(UserCreateRequest request) {
        validateUniqueness(request);
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        return switch (request.getAccountType().toUpperCase()) {
            case "ADMIN" -> adminRepository.save(Admin.builder()
                    .username(request.getUsername())
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .role(StaffRole.ADMIN)
                    .active(true)
                    .build());

            case "CUSTOM_OFFICER" -> customOfficerRepository.save(CustomOfficer.builder()
                    .username(request.getUsername())
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .role(StaffRole.CUSTOM_OFFICER)
                    .active(true)
                    .build());

            case "INSPECTOR" -> inspectorRepository.save(Inspector.builder()
                    .username(request.getUsername())
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .role(StaffRole.INSPECTOR)
                    .active(true)
                    .build());

            case "DRIVER" -> {
                if (request.getVehicleNo() == null || request.getVehicleNo().isBlank()) {
                    throw new BadRequestException("vehicleNo is required for DRIVER accounts");
                }
                yield driverRepository.save(Driver.builder()
                        .username(request.getUsername())
                        .firstname(request.getFirstname())
                        .lastname(request.getLastname())
                        .email(request.getEmail())
                        .password(encodedPassword)
                        .vehicleNo(request.getVehicleNo())
                        .active(true)
                        .build());
            }

            case "OWNER" -> ownerRepository.save(Owner.builder()
                    .username(request.getUsername())
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .active(true)
                    .build());

            default -> throw new BadRequestException("Unknown accountType: " + request.getAccountType());
        };
    }

    private void validateUniqueness(UserCreateRequest request) {
        boolean usernameTaken = staffRepository.existsByUsername(request.getUsername())
                || driverRepository.existsByUsername(request.getUsername())
                || ownerRepository.existsByUsername(request.getUsername());
        if (usernameTaken) {
            throw new BadRequestException("Username already exists: " + request.getUsername());
        }

        boolean emailTaken = staffRepository.existsByEmail(request.getEmail())
                || driverRepository.existsByEmail(request.getEmail())
                || ownerRepository.existsByEmail(request.getEmail());
        if (emailTaken) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    @Transactional
    public void deactivateStaff(Long staffId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + staffId));
        staff.setActive(false);
        staffRepository.save(staff);
    }

    @Transactional
    public void deleteStaff(Long staffId) {
        if (!staffRepository.existsById(staffId)) {
            throw new ResourceNotFoundException("Staff not found: " + staffId);
        }
        staffRepository.deleteById(staffId);
    }
}
