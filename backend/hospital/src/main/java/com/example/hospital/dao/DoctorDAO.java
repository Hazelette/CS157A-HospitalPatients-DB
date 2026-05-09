package com.example.hospital.dao;

import com.example.hospital.model.Doctor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DoctorDAO {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    // Opens a JDBC connection using Spring datasource credentials.
    private Connection getConnection() throws Exception {
        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    public List<Doctor> getAllDoctors() throws Exception {
        // READ: fetches all doctors.
        String sql = "SELECT DoctorID, DoctorName, Specialty, Phone, Email, DepartmentID FROM Doctors";
        return queryDoctors(sql, null);
    }

    public List<Doctor> getDoctorsByDepartment(int departmentID) throws Exception {
        // READ: fetches doctors in a specific department.
        String sql = "SELECT DoctorID, DoctorName, Specialty, Phone, Email, DepartmentID FROM Doctors WHERE DepartmentID = ?";
        return queryDoctors(sql, departmentID);
    }

    public Doctor createDoctor(Doctor doctor) throws Exception {
        // CREATE: inserts a new doctor row.
        String sql = """
            INSERT INTO Doctors (DoctorName, Specialty, Phone, Email, DepartmentID)
            VALUES (?, ?, ?, ?, ?)
            """;

        // Use RETURN_GENERATED_KEYS to capture DoctorID from the DB.
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, doctor.getDoctorName());
            stmt.setString(2, doctor.getSpecialty());
            stmt.setString(3, doctor.getPhone());
            stmt.setString(4, doctor.getEmail());
            stmt.setInt(5, doctor.getDepartmentID());
            stmt.executeUpdate();

            // Copy generated ID into response model.
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    doctor.setDoctorID(keys.getInt(1));
                }
            }
        }

        return doctor;
    }

    public boolean deleteDoctor(int id) throws Exception {
        // DELETE: removes a doctor by primary key.
        String sql = "DELETE FROM Doctors WHERE DoctorID = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    private List<Doctor> queryDoctors(String sql, Integer departmentID) throws Exception {
        List<Doctor> doctors = new ArrayList<>();

        // Shared JDBC helper for doctor SELECT queries.
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            if (departmentID != null) {
                stmt.setInt(1, departmentID);
            }

            // ResultSet-to-model mapping for each doctor row.
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Doctor doctor = new Doctor();
                    doctor.setDoctorID(rs.getInt("DoctorID"));
                    doctor.setDoctorName(rs.getString("DoctorName"));
                    doctor.setSpecialty(rs.getString("Specialty"));
                    doctor.setPhone(rs.getString("Phone"));
                    doctor.setEmail(rs.getString("Email"));
                    doctor.setDepartmentID(rs.getInt("DepartmentID"));
                    doctors.add(doctor);
                }
            }
        }

        return doctors;
    }
}
