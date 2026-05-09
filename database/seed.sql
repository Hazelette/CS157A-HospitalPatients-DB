USE hospital_db;

-- ----------------------
-- Departments
-- ----------------------
INSERT INTO Departments (DepartmentName, Location) VALUES
('Cardiology', 'Block A'),
('Neurology', 'Block B'),
('Orthopedics', 'Block C'),
('Pediatrics', 'Block D'),
('Oncology', 'Block E'),
('Dermatology', 'Block F'),
('Gastroenterology', 'Block G'),
('Pulmonology', 'Block H'),
('Urology', 'Block I'),
('Nephrology', 'Block J'),
('ENT', 'Block K'),
('Ophthalmology', 'Block L'),
('Psychiatry', 'Block M'),
('Radiology', 'Block N'),
('Emergency Medicine', 'Block O');

-- ----------------------
-- Doctors
-- ----------------------
INSERT INTO Doctors (DoctorName, Specialty, Phone, Email, DepartmentID) VALUES
('Dr. Alice Smith', 'Cardiologist', '1234567890', 'alice@hospital.com', 1),
('Dr. Bob Johnson', 'Neurologist', '2345678901', 'bob@hospital.com', 2),
('Dr. Carol Lee', 'Orthopedic Surgeon', '3456789012', 'carol@hospital.com', 3),
('Dr. David Kim', 'Pediatrician', '4567890123', 'david.kim@hospital.com', 4),
('Dr. Emma Davis', 'Oncologist', '5678901234', 'emma.davis@hospital.com', 5),
('Dr. Frank Miller', 'Dermatologist', '6789012345', 'frank.miller@hospital.com', 6),
('Dr. Grace Wilson', 'Gastroenterologist', '7890123456', 'grace.wilson@hospital.com', 7),
('Dr. Henry Moore', 'Pulmonologist', '8901234567', 'henry.moore@hospital.com', 8),
('Dr. Irene Taylor', 'Urologist', '9012345678', 'irene.taylor@hospital.com', 9),
('Dr. Jack Anderson', 'Nephrologist', '1122334455', 'jack.anderson@hospital.com', 10),
('Dr. Karen Thomas', 'ENT Specialist', '2233445566', 'karen.thomas@hospital.com', 11),
('Dr. Liam Jackson', 'Ophthalmologist', '3344556677', 'liam.jackson@hospital.com', 12),
('Dr. Maya White', 'Psychiatrist', '4455667788', 'maya.white@hospital.com', 13),
('Dr. Noah Harris', 'Radiologist', '5566778899', 'noah.harris@hospital.com', 14),
('Dr. Olivia Martin', 'Emergency Physician', '6677889900', 'olivia.martin@hospital.com', 15);
-- ----------------------
-- Patients
-- ----------------------
INSERT INTO Patients (FirstName, LastName, Gender, DateOfBirth, Phone, Address, BloodGroup) VALUES
('John', 'Doe', 'Male', '1990-05-12', '5551112222', '123 Main St', 'O+'),
('Jane', 'Smith', 'Female', '1985-08-22', '5553334444', '456 Oak Ave', 'A+'),
('Michael', 'Brown', 'Male', '2000-01-10', '5555556666', '789 Pine Rd', 'B+'),
('Emily', 'Clark', 'Female', '1993-03-14', '5557778888', '101 Maple St', 'AB+'),
('Daniel', 'Lewis', 'Male', '1978-11-30', '5559990001', '202 Cedar Ln', 'O-'),
('Sophia', 'Walker', 'Female', '1999-07-19', '5552223333', '303 Birch Blvd', 'A-'),
('James', 'Hall', 'Male', '1988-02-09', '5554445555', '404 Walnut Dr', 'B-'),
('Isabella', 'Allen', 'Female', '1995-09-25', '5556667777', '505 Spruce Ct', 'O+'),
('Benjamin', 'Young', 'Male', '1982-12-03', '5558889999', '606 Ash Pl', 'AB-'),
('Mia', 'King', 'Female', '2001-06-11', '5551010101', '707 Poplar Way', 'A+'),
('Lucas', 'Wright', 'Male', '1975-04-27', '5551212121', '808 Cypress Rd', 'B+'),
('Charlotte', 'Scott', 'Female', '1997-10-16', '5551313131', '909 Fir Ave', 'O-'),
('Ethan', 'Green', 'Male', '1989-01-05', '5551414141', '111 Elm St', 'A-'),
('Amelia', 'Baker', 'Female', '1992-08-08', '5551515151', '222 Willow Ln', 'AB+'),
('Logan', 'Adams', 'Male', '1984-05-29', '5551616161', '333 Redwood Blvd', 'B-');

-- ----------------------
-- Rooms
-- ----------------------
INSERT INTO Rooms (RoomNumber, Availability) VALUES
('101', 'Available'),
('102', 'Occupied'),
('103', 'Available'),
('104', 'Available'),
('105', 'Occupied'),
('106', 'Available'),
('107', 'Available'),
('108', 'Occupied'),
('109', 'Available'),
('110', 'Available'),
('111', 'Occupied'),
('112', 'Available'),
('113', 'Available'),
('114', 'Occupied'),
('115', 'Available');

-- ----------------------
-- Appointments
-- ----------------------
INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime, Status) VALUES
(1, 1, '2026-05-01', '10:00:00', 'Scheduled'),
(2, 2, '2026-05-02', '11:30:00', 'Completed'),
(3, 3, '2026-05-03', '09:15:00', 'Cancelled'),
(4, 4, '2026-05-04', '13:00:00', 'Scheduled'),
(5, 5, '2026-05-05', '14:30:00', 'Scheduled'),
(6, 6, '2026-05-06', '08:45:00', 'Completed'),
(7, 7, '2026-05-07', '15:20:00', 'Scheduled'),
(8, 8, '2026-05-08', '10:10:00', 'Cancelled'),
(9, 9, '2026-05-09', '16:00:00', 'Scheduled'),
(10, 10, '2026-05-10', '09:00:00', 'Completed'),
(11, 11, '2026-05-11', '11:10:00', 'Scheduled'),
(12, 12, '2026-05-12', '12:25:00', 'Scheduled'),
(13, 13, '2026-05-13', '14:05:00', 'Cancelled'),
(14, 14, '2026-05-14', '10:40:00', 'Scheduled'),
(15, 15, '2026-05-15', '09:35:00', 'Completed');

-- ----------------------
-- Admissions
-- ----------------------
INSERT INTO Admissions (PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis) VALUES
(2, 2, 2, '2026-04-18', '2026-04-25', 'Migraine'),
(1, 1, 1, '2026-04-10', '2026-04-14', 'Heart Condition'),
(3, 3, 3, '2026-04-22', '2026-04-29', 'Fracture'),
(4, 4, 4, '2026-04-11', '2026-04-13', 'Pneumonia'),
(5, 5, 5, '2026-04-05', '2026-04-12', 'Breast Cancer'),
(6, 6, 6, '2026-04-08', '2026-04-10', 'Severe Eczema'),
(7, 7, 7, '2026-04-14', '2026-04-18', 'Gastritis'),
(8, 8, 8, '2026-04-15', '2026-04-21', 'Asthma Attack'),
(9, 9, 9, '2026-04-16', '2026-04-22', 'Kidney Stones'),
(10, 10, 10, '2026-04-17', '2026-04-24', 'Chronic Kidney Disease'),
(11, 11, 11, '2026-04-18', '2026-04-20', 'Sinus Infection'),
(12, 12, 12, '2026-04-19', '2026-04-23', 'Cataract'),
(13, 13, 13, '2026-04-20', '2026-04-27', 'Anxiety Disorder'),
(14, 14, 14, '2026-04-21', '2026-04-26', 'Chest Imaging Follow-up'),
(15, 15, 15, '2026-04-22', '2026-04-25', 'Acute Trauma');
