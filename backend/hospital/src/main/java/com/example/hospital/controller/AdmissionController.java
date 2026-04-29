package com.example.hospital.controller;

import com.example.hospital.model.Admission;
import com.example.hospital.repository.AdmissionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admissions")
@CrossOrigin(origins = "http://localhost:3000")
public class AdmissionController {

    private final AdmissionRepository admissionRepository;

    public AdmissionController(AdmissionRepository admissionRepository) {
        this.admissionRepository = admissionRepository;
    }

    @GetMapping
    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    @PostMapping
    public Admission createAdmission(@RequestBody Admission admission) {
        return admissionRepository.save(admission);
    }
}