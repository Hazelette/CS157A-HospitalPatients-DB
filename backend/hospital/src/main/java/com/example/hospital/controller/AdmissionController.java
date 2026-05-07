package com.example.hospital.controller;

import com.example.hospital.dao.AdmissionDAO;
import com.example.hospital.exception.BadRequestException;
import com.example.hospital.exception.ConflictException;
import com.example.hospital.exception.NotFoundException;
import com.example.hospital.model.Admission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admissions")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AdmissionController {

    private final AdmissionDAO admissionDAO;

    public AdmissionController(AdmissionDAO admissionDAO) {
        this.admissionDAO = admissionDAO;
    }

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() throws Exception {
        return ResponseEntity.ok(admissionDAO.getAllAdmissions());
    }

    @PostMapping
    public ResponseEntity<Admission> createAdmission(@RequestBody Admission admission) throws Exception {
        validateAdmission(admission);

        if (!admissionDAO.patientExists(admission.getPatientID())) {
            throw new NotFoundException("Patient with ID " + admission.getPatientID() + " not found");
        }
        if (!admissionDAO.doctorExists(admission.getDoctorID())) {
            throw new NotFoundException("Doctor with ID " + admission.getDoctorID() + " not found");
        }
        if (!admissionDAO.roomExists(admission.getRoomID())) {
            throw new NotFoundException("Room with ID " + admission.getRoomID() + " not found");
        }
        if (admission.getDischargeDate() == null && !admissionDAO.isRoomAvailable(admission.getRoomID())) {
            throw new ConflictException("Room " + admission.getRoomID() + " is not available");
        }

        return ResponseEntity.ok(admissionDAO.createAdmission(admission));
    }

    @PutMapping("/{id}/discharge")
    public ResponseEntity<Admission> dischargePatient(
            @PathVariable int id,
            @RequestBody(required = false) Map<String, String> body) throws Exception {

        LocalDate dischargeDate;
        if (body != null && body.get("dischargeDate") != null && !body.get("dischargeDate").isBlank()) {
            try {
                dischargeDate = LocalDate.parse(body.get("dischargeDate"));
            } catch (Exception e) {
                throw new BadRequestException("dischargeDate must be in YYYY-MM-DD format");
            }
        } else {
            dischargeDate = LocalDate.now();
        }

        Admission discharged = admissionDAO.dischargePatient(id, dischargeDate);
        if (discharged == null) {
            throw new NotFoundException("Admission with ID " + id + " not found");
        }
        if (dischargeDate.isBefore(discharged.getAdmissionDate())) {
            throw new BadRequestException("dischargeDate cannot be before admissionDate");
        }
        return ResponseEntity.ok(discharged);
    }

    private void validateAdmission(Admission admission) {
        if (admission == null) {
            throw new BadRequestException("Request body is required");
        }
        if (admission.getPatientID() == null) {
            throw new BadRequestException("patientID is required");
        }
        if (admission.getDoctorID() == null) {
            throw new BadRequestException("doctorID is required");
        }
        if (admission.getRoomID() == null) {
            throw new BadRequestException("roomID is required");
        }
        if (admission.getAdmissionDate() == null) {
            throw new BadRequestException("admissionDate is required");
        }
        if (admission.getDiagnosis() == null || admission.getDiagnosis().trim().isEmpty()) {
            throw new BadRequestException("diagnosis is required");
        }
        if (admission.getDischargeDate() != null
                && admission.getDischargeDate().isBefore(admission.getAdmissionDate())) {
            throw new BadRequestException("dischargeDate cannot be before admissionDate");
        }
    }
}
