package com.example.hospital.controller;

import com.example.hospital.model.Doctor;
import com.example.hospital.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @GetMapping("/department/{departmentID}")
    public List<Doctor> getDoctorsByDepartment(@PathVariable Integer departmentID) {
        return doctorRepository.findByDepartmentID(departmentID);
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Integer id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        doctorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}