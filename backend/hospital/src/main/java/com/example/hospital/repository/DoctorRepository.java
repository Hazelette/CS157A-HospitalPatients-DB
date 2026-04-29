package com.example.hospital.repository;

import com.example.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    List<Doctor> findByDepartmentID(Integer departmentID);
}