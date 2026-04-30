-- ----------------------
-- SELECT queries
-- ----------------------

-- Get all patients
SELECT * FROM Patients;

-- Get all doctors in a department
SELECT * FROM Doctors
WHERE DepartmentID = 1;

-- Get all appointments for a patient
SELECT * FROM Appointments
WHERE PatientID = 1;

-- Get available rooms
SELECT * FROM Rooms
WHERE Availability = 'Available';

-- ----------------------
-- INSERT queries
-- ----------------------

-- Add a new patient
INSERT INTO Patients (FirstName, LastName, Gender, DateOfBirth, Phone, Address, BloodGroup)
VALUES ('Alice', 'Brown', 'Female', '1995-06-15', '5557779999', '456 Elm St', 'A+');

-- Add a new doctor
INSERT INTO Doctors (DoctorName, Specialty, Phone, Email, DepartmentID)
VALUES ('Dr. James Kim', 'Cardiology', '5551234567', 'jkim@hospital.com', 1);

-- ----------------------
-- UPDATE queries
-- ----------------------

-- Cancel an appointment
UPDATE Appointments
SET Status = 'Cancelled'
WHERE AppointmentID = 1;

-- Update room availability
UPDATE Rooms
SET Availability = 'Occupied'
WHERE RoomID = 1;

-- ----------------------
-- DELETE queries
-- ----------------------

-- Delete a patient
DELETE FROM Patients
WHERE PatientID = 3;

-- Delete a doctor
DELETE FROM Doctors
WHERE DoctorID = 4;