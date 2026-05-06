package com.example.hospital.controller;

import com.example.hospital.dao.AppointmentDAO;
import com.example.hospital.exception.BadRequestException;
import com.example.hospital.exception.ConflictException;
import com.example.hospital.exception.NotFoundException;
import com.example.hospital.model.Appointment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AppointmentController {

    private static final Set<String> VALID_STATUSES = Set.of("Scheduled", "Completed", "Cancelled");

    private final AppointmentDAO appointmentDAO;

    public AppointmentController(AppointmentDAO appointmentDAO) {
        this.appointmentDAO = appointmentDAO;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() throws Exception {
        return ResponseEntity.ok(appointmentDAO.getAllAppointments());
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) throws Exception {
        validateAppointment(appointment);

        if (!appointmentDAO.patientExists(appointment.getPatientID())) {
            throw new NotFoundException("Patient with ID " + appointment.getPatientID() + " not found");
        }
        if (!appointmentDAO.doctorExists(appointment.getDoctorID())) {
            throw new NotFoundException("Doctor with ID " + appointment.getDoctorID() + " not found");
        }
        if (appointmentDAO.hasConflictingAppointment(
                appointment.getDoctorID(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime())) {
            throw new ConflictException(
                "Doctor " + appointment.getDoctorID()
                + " already has an appointment at " + appointment.getAppointmentDate()
                + " " + appointment.getAppointmentTime()
            );
        }

        return ResponseEntity.ok(appointmentDAO.createAppointment(appointment));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Integer id) throws Exception {
        Appointment updated = appointmentDAO.cancelAppointment(id);
        if (updated == null) {
            throw new NotFoundException("Appointment with ID " + id + " not found");
        }
        return ResponseEntity.ok(updated);
    }

    private void validateAppointment(Appointment appointment) {
        if (appointment == null) {
            throw new BadRequestException("Request body is required");
        }
        if (appointment.getPatientID() == null) {
            throw new BadRequestException("patientID is required");
        }
        if (appointment.getDoctorID() == null) {
            throw new BadRequestException("doctorID is required");
        }
        if (appointment.getAppointmentDate() == null) {
            throw new BadRequestException("appointmentDate is required");
        }
        if (appointment.getAppointmentTime() == null) {
            throw new BadRequestException("appointmentTime is required");
        }
        if (appointment.getStatus() == null || appointment.getStatus().trim().isEmpty()) {
            appointment.setStatus("Scheduled");
        } else if (!VALID_STATUSES.contains(appointment.getStatus())) {
            throw new BadRequestException(
                "status must be one of " + VALID_STATUSES + " (got: " + appointment.getStatus() + ")"
            );
        }

        LocalDateTime appointmentDateTime = LocalDateTime.of(
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime()
        );
        if (appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("appointment cannot be scheduled in the past");
        }
    }
}
