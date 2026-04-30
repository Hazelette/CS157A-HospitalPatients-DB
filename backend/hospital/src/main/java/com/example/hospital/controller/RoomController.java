package com.example.hospital.controller;

import com.example.hospital.dao.RoomDAO;
import com.example.hospital.model.Room;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    private final RoomDAO roomDAO;

    public RoomController(RoomDAO roomDAO) {
        this.roomDAO = roomDAO;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        try {
            return ResponseEntity.ok(roomDAO.getAllRooms());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        try {
            return ResponseEntity.ok(roomDAO.getRoomsByAvailability("Available"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
