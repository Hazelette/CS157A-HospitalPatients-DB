package com.example.hospital.dao;

import com.example.hospital.model.Department;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DepartmentDAO {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    private Connection getConnection() throws Exception {
        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    public List<Department> getAllDepartments() throws Exception {
        List<Department> departments = new ArrayList<>();
        String sql = "SELECT DepartmentID, DepartmentName, Location FROM Departments";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Department department = new Department();
                department.setDepartmentID(rs.getInt("DepartmentID"));
                department.setDepartmentName(rs.getString("DepartmentName"));
                department.setLocation(rs.getString("Location"));
                departments.add(department);
            }
        }

        return departments;
    }
}
