package com.example.hospital.repository;

import com.example.hospital.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByAvailability(String availability);
}