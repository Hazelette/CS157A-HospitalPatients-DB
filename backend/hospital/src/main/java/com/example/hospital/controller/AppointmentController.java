package com.example.hospital.controller;

import com.example.hospital.dao.AppointmentDAO;
import com.example.hospital.model.Appointment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AppointmentController {

    private final AppointmentDAO appointmentDAO;

    public AppointmentController(AppointmentDAO appointmentDAO) {
        this.appointmentDAO = appointmentDAO;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        try {
            return ResponseEntity.ok(appointmentDAO.getAllAppointments());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        try {
            return ResponseEntity.ok(appointmentDAO.createAppointment(appointment));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Integer id) {
        try {
            Appointment updatedAppointment = appointmentDAO.cancelAppointment(id);
            return updatedAppointment != null
                    ? ResponseEntity.ok(updatedAppointment)
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
