package com.example.hospital.controller;

import com.example.hospital.dao.DoctorDAO;
import com.example.hospital.model.Doctor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DoctorController {

    private final DoctorDAO doctorDAO;

    public DoctorController(DoctorDAO doctorDAO) {
        this.doctorDAO = doctorDAO;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        try {
            return ResponseEntity.ok(doctorDAO.getAllDoctors());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/department/{departmentID}")
    public ResponseEntity<List<Doctor>> getDoctorsByDepartment(@PathVariable Integer departmentID) {
        try {
            return ResponseEntity.ok(doctorDAO.getDoctorsByDepartment(departmentID));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        try {
            return ResponseEntity.ok(doctorDAO.createDoctor(doctor));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Integer id) {
        try {
            boolean deleted = doctorDAO.deleteDoctor(id);
            return deleted ? ResponseEntity.noContent().build()
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
