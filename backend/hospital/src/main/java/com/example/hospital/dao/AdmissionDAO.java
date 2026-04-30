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
        String sql = """
            INSERT INTO Admissions (PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis)
            VALUES (?, ?, ?, ?, ?, ?)
            """;

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

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

        return admission;
    }
}
