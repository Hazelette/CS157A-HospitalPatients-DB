package com.example.hospital.dao;

import com.example.hospital.model.Admission;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AdmissionDAO {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    private Connection getConnection() throws Exception {
        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    public List<Admission> getAllAdmissions() throws Exception {
        List<Admission> admissions = new ArrayList<>();
        String sql = "SELECT AdmissionID, PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis FROM Admissions";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Admission admission = new Admission();
                admission.setAdmissionID(rs.getInt("AdmissionID"));
                admission.setPatientID(rs.getInt("PatientID"));
                admission.setDoctorID(rs.getInt("DoctorID"));
                admission.setRoomID(rs.getInt("RoomID"));
                admission.setAdmissionDate(rs.getDate("AdmissionDate").toLocalDate());

                Date dischargeDate = rs.getDate("DischargeDate");
                admission.setDischargeDate(dischargeDate == null ? null : dischargeDate.toLocalDate());

                admission.setDiagnosis(rs.getString("Diagnosis"));
                admissions.add(admission);
            }
        }

        return admissions;
    }

    public Admission createAdmission(Admission admission) throws Exception {
        String insertSql = """
            INSERT INTO Admissions (PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis)
            VALUES (?, ?, ?, ?, ?, ?)
            """;
        String updateRoomSql = "UPDATE Rooms SET Availability = 'Occupied' WHERE RoomID = ?";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);
            try {
                try (PreparedStatement stmt = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                    stmt.setInt(1, admission.getPatientID());
                    stmt.setInt(2, admission.getDoctorID());
                    stmt.setInt(3, admission.getRoomID());
                    stmt.setDate(4, Date.valueOf(admission.getAdmissionDate()));

                    if (admission.getDischargeDate() != null) {
                        stmt.setDate(5, Date.valueOf(admission.getDischargeDate()));
                    } else {
                        stmt.setNull(5, java.sql.Types.DATE);
                    }

                    stmt.setString(6, admission.getDiagnosis());
                    stmt.executeUpdate();

                    try (ResultSet keys = stmt.getGeneratedKeys()) {
                        if (keys.next()) {
                            admission.setAdmissionID(keys.getInt(1));
                        }
                    }
                }

                if (admission.getDischargeDate() == null) {
                    try (PreparedStatement roomStmt = conn.prepareStatement(updateRoomSql)) {
                        roomStmt.setInt(1, admission.getRoomID());
                        roomStmt.executeUpdate();
                    }
                }

                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        }

        return admission;
    }

    public Admission dischargePatient(int admissionId, LocalDate dischargeDate) throws Exception {
        String selectSql = "SELECT AdmissionID, PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis FROM Admissions WHERE AdmissionID = ?";
        String updateAdmissionSql = "UPDATE Admissions SET DischargeDate = ? WHERE AdmissionID = ?";
        String updateRoomSql = "UPDATE Rooms SET Availability = 'Available' WHERE RoomID = ?";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);
            try {
                Admission admission;
                try (PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {
                    selectStmt.setInt(1, admissionId);
                    try (ResultSet rs = selectStmt.executeQuery()) {
                        if (!rs.next()) {
                            return null;
                        }
                        admission = new Admission();
                        admission.setAdmissionID(rs.getInt("AdmissionID"));
                        admission.setPatientID(rs.getInt("PatientID"));
                        admission.setDoctorID(rs.getInt("DoctorID"));
                        admission.setRoomID(rs.getInt("RoomID"));
                        admission.setAdmissionDate(rs.getDate("AdmissionDate").toLocalDate());
                        Date existingDischarge = rs.getDate("DischargeDate");
                        admission.setDischargeDate(existingDischarge == null ? null : existingDischarge.toLocalDate());
                        admission.setDiagnosis(rs.getString("Diagnosis"));
                    }
                }

                try (PreparedStatement updateStmt = conn.prepareStatement(updateAdmissionSql)) {
                    updateStmt.setDate(1, Date.valueOf(dischargeDate));
                    updateStmt.setInt(2, admissionId);
                    updateStmt.executeUpdate();
                }

                try (PreparedStatement roomStmt = conn.prepareStatement(updateRoomSql)) {
                    roomStmt.setInt(1, admission.getRoomID());
                    roomStmt.executeUpdate();
                }

                conn.commit();
                admission.setDischargeDate(dischargeDate);
                return admission;
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public boolean patientExists(int patientId) throws Exception {
        return existsBy("Patients", "PatientID", patientId);
    }

    public boolean doctorExists(int doctorId) throws Exception {
        return existsBy("Doctors", "DoctorID", doctorId);
    }

    public boolean roomExists(int roomId) throws Exception {
        return existsBy("Rooms", "RoomID", roomId);
    }

    public boolean isRoomAvailable(int roomId) throws Exception {
        String sql = "SELECT Availability FROM Rooms WHERE RoomID = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, roomId);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() && "Available".equalsIgnoreCase(rs.getString("Availability"));
            }
        }
    }

    private boolean existsBy(String table, String idColumn, int id) throws Exception {
        String sql = "SELECT 1 FROM " + table + " WHERE " + idColumn + " = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }
}
