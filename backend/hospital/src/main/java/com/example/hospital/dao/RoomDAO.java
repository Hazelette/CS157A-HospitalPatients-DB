package com.example.hospital.dao;

import com.example.hospital.model.Room;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RoomDAO {

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

    public List<Room> getAllRooms() throws Exception {
        // READ: fetches every room record.
        String sql = "SELECT RoomID, RoomNumber, Availability FROM Rooms";
        return queryRooms(sql, null);
    }

    public List<Room> getRoomsByAvailability(String availability) throws Exception {
        // READ: fetches rooms filtered by availability status.
        String sql = "SELECT RoomID, RoomNumber, Availability FROM Rooms WHERE Availability = ?";
        return queryRooms(sql, availability);
    }

    private List<Room> queryRooms(String sql, String availability) throws Exception {
        List<Room> rooms = new ArrayList<>();

        // Shared JDBC SELECT helper for room queries.
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            if (availability != null) {
                stmt.setString(1, availability);
            }

            // ResultSet-to-model mapping for each room row.
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Room room = new Room();
                    room.setRoomID(rs.getInt("RoomID"));
                    room.setRoomNumber(rs.getString("RoomNumber"));
                    room.setAvailability(rs.getString("Availability"));
                    rooms.add(room);
                }
            }
        }

        return rooms;
    }
}
