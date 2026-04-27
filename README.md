# CS157A-HospitalPatients-DB
Overview: Our project idea is to make a patient management system for hospitals which allows the easy tracking of where patients are located, which patients doctors are responsible for and future appointments. 
Purpose:This system is useful as hospitals handle large amounts of patient and scheduling data everyday. A centralized database like this reduces overhead that staff have to deal with by organizing records efficiently and improve data accuracy to allow for quick information retrieval

3. Objectives
Primary Goals: We want to maintain an accurate record of patients and the appointments they scheduled. This will also help doctors with their schedules by providing a clear view of availability and patient details.Our database management system will support common operations like queries, inserts and updates

Functionality Overview : Reception Staff and Hospital Administrators will use the database to add patients, manage doctors and schedule appointments with room assignment and record updates

4. Proposed Database Schema:
Entities: 
Patients (PatientID, FirstName, LastName, Gender, DateOfBirth, Phone, Address, BloodGroup)  
Doctors (DoctorID, DoctorName, Specialty, Phone, Email, DepartmentID)
Departments (DepartmentID, DepartmentName, Location)
Appointments (AppointmentID, PatientID, DoctorID, AppointmentDate, AppointmentTime, Status)
Admissions (AdmissionID, PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis)
Rooms (RoomID, RoomNumber, Availability)

Relationships:
A one-to-many relationship between Department and Doctors
A one-to-many relationship between Patients and Appointments
A one-to-many relationship between Doctors and Appointments
A one-to-many relationship between Patient and Admissions
A one-to-many relationship between Rooms and Admissions
A one-to-many relationship between Doctor and Patients
5. Functional Requirements:
User Description: Reception Staff, Hospital Administrators, Authorized Medical Staff

Key Functionalities: 
Add, view and delete patient records
Schedule and cancel appointments 
Assign and track room availability
Handle patient admissions

7. Tools and Technologies:
Database: MySQL
Backend: Java
Frontend: React
IDE: VS Code
Database Management: MySQL Workbench
8. Conclusion
Expected Outcomes: A working hospital database application that supports key hospital record management tasks with accurate and efficient data handling.
