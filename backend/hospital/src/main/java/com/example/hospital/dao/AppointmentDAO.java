package com.example.hospital.dao;

import com.example.hospital.model.Appointment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AppointmentDAO {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    private Connection getConnection() throws Exception {
        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    public List<Appointment> getAllAppointments() throws Exception {
        List<Appointment> appointments = new ArrayList<>();
        String sql = "SELECT AppointmentID, PatientID, DoctorID, AppointmentDate, AppointmentTime, Status FROM Appointments";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Appointment appointment = new Appointment();
                appointment.setAppointmentID(rs.getInt("AppointmentID"));
                appointment.setPatientID(rs.getInt("PatientID"));
                appointment.setDoctorID(rs.getInt("DoctorID"));
                appointment.setAppointmentDate(rs.getDate("AppointmentDate").toLocalDate());
                appointment.setAppointmentTime(rs.getTime("AppointmentTime").toLocalTime());
                appointment.setStatus(rs.getString("Status"));
                appointments.add(appointment);
            }
        }

        return appointments;
    }

    public Appointment createAppointment(Appointment appointment) throws Exception {
        String sql = """
            INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime, Status)
            VALUES (?, ?, ?, ?, ?)
            """;

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, appointment.getPatientID());
            stmt.setInt(2, appointment.getDoctorID());
            stmt.setDate(3, Date.valueOf(appointment.getAppointmentDate()));
            stmt.setTime(4, Time.valueOf(appointment.getAppointmentTime()));
            stmt.setString(5, appointment.getStatus());
            stmt.executeUpdate();

            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    appointment.setAppointmentID(keys.getInt(1));
                }
            }
        }

        return appointment;
    }

    public Appointment cancelAppointment(int id) throws Exception {
        String updateSql = "UPDATE Appointments SET Status = 'Cancelled' WHERE AppointmentID = ?";
        String selectSql = "SELECT AppointmentID, PatientID, DoctorID, AppointmentDate, AppointmentTime, Status FROM Appointments WHERE AppointmentID = ?";

        try (Connection conn = getConnection();
             PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {

            updateStmt.setInt(1, id);
            int rowsUpdated = updateStmt.executeUpdate();

            if (rowsUpdated == 0) {
                return null;
            }

            try (PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {
                selectStmt.setInt(1, id);

                try (ResultSet rs = selectStmt.executeQuery()) {
                    if (rs.next()) {
                        Appointment appointment = new Appointment();
                        appointment.setAppointmentID(rs.getInt("AppointmentID"));
                        appointment.setPatientID(rs.getInt("PatientID"));
                        appointment.setDoctorID(rs.getInt("DoctorID"));
                        appointment.setAppointmentDate(rs.getDate("AppointmentDate").toLocalDate());
                        appointment.setAppointmentTime(rs.getTime("AppointmentTime").toLocalTime());
                        appointment.setStatus(rs.getString("Status"));
                        return appointment;
                    }
                }
            }
        }

        return null;
    }
}
