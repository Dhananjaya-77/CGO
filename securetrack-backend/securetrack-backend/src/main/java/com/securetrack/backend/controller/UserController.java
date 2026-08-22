package com.securetrack.backend.controller;

import com.securetrack.backend.dto.ProfileDTO;
import com.securetrack.backend.models.Staff;
import com.securetrack.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private StaffRepository staffRepository;

    // 1. ලොග් වී සිටින User ගේ දත්ත Frontend එකට යැවීම
    @GetMapping("/me")
    public ProfileDTO getMyProfile(Principal principal) {
        // Principal හරහා Token එකෙන් එන Username එක ලබාගැනීම
        Staff staff = staffRepository.findByUsername(principal.getName()).orElse(null); 
        ProfileDTO dto = new ProfileDTO();
        
        if (staff != null) {
            dto.setFirstName(staff.getFirstname());
            dto.setLastName(staff.getLastname());
            dto.setEmail(staff.getEmail());
            dto.setPhone("+94 77 1234567"); 
            
            dto.setEmailAlerts(staff.isEmailAlerts());
            dto.setSmsAlerts(staff.isSmsAlerts());
            dto.setSystemAlerts(staff.isSystemAlerts());
            dto.setTwoFactorAuth(staff.isTwoFactorAuth());
            dto.setLanguage(staff.getLanguage() != null ? staff.getLanguage() : "English");
            dto.setTimezone(staff.getTimezone() != null ? staff.getTimezone() : "Asia/Colombo");
        }
        
        return dto;
    }

    // 2. Settings ටැබ්ස් වල වෙනස්කම් Save කිරීම
    @PutMapping("/me")
    public ProfileDTO updateProfile(@RequestBody ProfileDTO dto, Principal principal) {
        Staff staff = staffRepository.findByUsername(principal.getName()).orElse(null);
        if (staff != null) {
            staff.setFirstname(dto.getFirstName());
            staff.setLastname(dto.getLastName());
            staff.setEmail(dto.getEmail());
            
            staff.setEmailAlerts(dto.isEmailAlerts());
            staff.setSmsAlerts(dto.isSmsAlerts());
            staff.setSystemAlerts(dto.isSystemAlerts());
            staff.setTwoFactorAuth(dto.isTwoFactorAuth());
            staff.setLanguage(dto.getLanguage());
            staff.setTimezone(dto.getTimezone());
            
            staffRepository.save(staff);
        }
        return dto;
    }

    // 3. Password වෙනස් කිරීම
    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody ProfileDTO.PasswordChangeRequest req, Principal principal) {
        Staff staff = staffRepository.findByUsername(principal.getName()).orElse(null);
        if (staff != null) {
            // (Production එකේදී මෙතන PasswordEncoder එකක් පාවිච්චි කරන්න වෙනවා. දැනට අපි කෙලින්ම සසඳමු)
            if (staff.getPassword().equals(req.getCurrentPassword())) {
                staff.setPassword(req.getNewPassword());
                staffRepository.save(staff);
                return ResponseEntity.ok().body("Password Updated");
            } else {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }
        }
        return ResponseEntity.badRequest().body("User not found");
    }
}