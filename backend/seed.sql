USE hospital_db;

-- ----------------------
-- Departments
-- ----------------------
INSERT INTO Departments (DepartmentName, Location) VALUES
('Cardiology', 'Block A'),
('Neurology', 'Block B'),
('Orthopedics', 'Block C');

-- ----------------------
-- Doctors
-- ----------------------
INSERT INTO Doctors (DoctorName, Specialty, Phone, Email, DepartmentID) VALUES
('Dr. Alice Smith', 'Cardiologist', '1234567890', 'alice@hospital.com', 1),
('Dr. Bob Johnson', 'Neurologist', '2345678901', 'bob@hospital.com', 2),
('Dr. Carol Lee', 'Orthopedic Surgeon', '3456789012', 'carol@hospital.com', 3);

-- ----------------------
-- Patients
-- ----------------------
INSERT INTO Patients (FirstName, LastName, Gender, DateOfBirth, Phone, Address, BloodGroup) VALUES
('John', 'Doe', 'Male', '1990-05-12', '5551112222', '123 Main St', 'O+'),
('Jane', 'Smith', 'Female', '1985-08-22', '5553334444', '456 Oak Ave', 'A+'),
('Michael', 'Brown', 'Male', '2000-01-10', '5555556666', '789 Pine Rd', 'B+');

-- ----------------------
-- Rooms
-- ----------------------
INSERT INTO Rooms (RoomNumber, Availability) VALUES
('101', 'Available'),
('102', 'Occupied'),
('103', 'Available');

-- ----------------------
-- Appointments
-- ----------------------
INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime, Status) VALUES
(1, 1, '2026-05-01', '10:00:00', 'Scheduled'),
(2, 2, '2026-05-02', '11:30:00', 'Completed'),
(3, 3, '2026-05-03', '09:15:00', 'Cancelled');

-- ----------------------
-- Admissions
-- ----------------------
INSERT INTO Admissions (PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis) VALUES
(1, 1, 2, '2026-04-20', NULL, 'Heart Condition'),
(2, 2, 2, '2026-04-18', '2026-04-25', 'Migraine'),
(3, 3, 3, '2026-04-22', NULL, 'Fracture');