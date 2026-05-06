package com.example.hospital.controller;

import com.example.hospital.dao.PatientDAO;
import com.example.hospital.exception.BadRequestException;
import com.example.hospital.exception.ConflictException;
import com.example.hospital.exception.NotFoundException;
import com.example.hospital.model.Patient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class PatientController {

    private final PatientDAO patientDAO;

    public PatientController(PatientDAO patientDAO) {
        this.patientDAO = patientDAO;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() throws Exception {
        return ResponseEntity.ok(patientDAO.getAllPatients());
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) throws Exception {
        validatePatient(patient);
        return ResponseEntity.ok(patientDAO.createPatient(patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable int id) throws Exception {
        try {
            boolean deleted = patientDAO.deletePatient(id);
            if (!deleted) {
                throw new NotFoundException("Patient with ID " + id + " not found");
            }
            return ResponseEntity.noContent().build();
        } catch (SQLIntegrityConstraintViolationException e) {
            throw new ConflictException(
                "Cannot delete patient " + id + ": existing appointments or admissions reference this patient"
            );
        }
    }

    private void validatePatient(Patient patient) {
        if (patient == null) {
            throw new BadRequestException("Request body is required");
        }
        if (isBlank(patient.getFirstName())) {
            throw new BadRequestException("firstName is required");
        }
        if (isBlank(patient.getLastName())) {
            throw new BadRequestException("lastName is required");
        }
        if (isBlank(patient.getGender())) {
            throw new BadRequestException("gender is required");
        }
        if (patient.getDateOfBirth() == null) {
            throw new BadRequestException("dateOfBirth is required");
        }
        if (patient.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new BadRequestException("dateOfBirth cannot be in the future");
        }
        if (isBlank(patient.getPhone())) {
            throw new BadRequestException("phone is required");
        }
        if (isBlank(patient.getAddress())) {
            throw new BadRequestException("address is required");
        }
        if (isBlank(patient.getBloodGroup())) {
            throw new BadRequestException("bloodGroup is required");
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
