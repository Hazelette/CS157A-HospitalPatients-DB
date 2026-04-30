package com.example.hospital.controller;

import com.example.hospital.dao.AdmissionDAO;
import com.example.hospital.model.Admission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admissions")
@CrossOrigin(origins = "http://localhost:3000")
public class AdmissionController {

    private final AdmissionDAO admissionDAO;

    public AdmissionController(AdmissionDAO admissionDAO) {
        this.admissionDAO = admissionDAO;
    }

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        try {
            return ResponseEntity.ok(admissionDAO.getAllAdmissions());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Admission> createAdmission(@RequestBody Admission admission) {
        try {
            return ResponseEntity.ok(admissionDAO.createAdmission(admission));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
