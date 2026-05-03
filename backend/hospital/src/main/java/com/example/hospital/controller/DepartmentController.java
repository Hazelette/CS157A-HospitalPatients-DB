package com.example.hospital.controller;

import com.example.hospital.dao.DepartmentDAO;
import com.example.hospital.model.Department;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DepartmentController {

    private final DepartmentDAO departmentDAO;

    public DepartmentController(DepartmentDAO departmentDAO) {
        this.departmentDAO = departmentDAO;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        try {
            return ResponseEntity.ok(departmentDAO.getAllDepartments());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
