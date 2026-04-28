# CS157A-HospitalPatients-DB

## Usage
To get started with the frontend after cloning:
```bash
npm install
npm start
```
The application will run on `http://localhost:3000`

## Overview
Our project is a **patient management system for hospitals** that enables efficient tracking of patient locations, doctor-patient assignments, and appointment scheduling.

**Purpose:**
Hospitals manage large volumes of patient and scheduling data daily. A centralized database reduces administrative overhead by organizing records efficiently and improving data accuracy for quick information retrieval.

## Objectives
**Primary Goals:**
- Maintain accurate records of patients and scheduled appointments
- Provide doctors with clear visibility of availability and patient details
- Support common database operations (queries, inserts, updates)

**Functionality:**
Reception staff and hospital administrators can add patients, manage doctors, schedule appointments with room assignments, and update records.

## Database Schema

**Entities:**
- **Patients:** PatientID, FirstName, LastName, Gender, DateOfBirth, Phone, Address, BloodGroup
- **Doctors:** DoctorID, DoctorName, Specialty, Phone, Email, DepartmentID
- **Departments:** DepartmentID, DepartmentName, Location
- **Appointments:** AppointmentID, PatientID, DoctorID, AppointmentDate, AppointmentTime, Status
- **Admissions:** AdmissionID, PatientID, DoctorID, RoomID, AdmissionDate, DischargeDate, Diagnosis
- **Rooms:** RoomID, RoomNumber, Availability

**Relationships:**
- Department → Doctors (1-to-many)
- Patients → Appointments (1-to-many)
- Doctors → Appointments (1-to-many)
- Patients → Admissions (1-to-many)
- Rooms → Admissions (1-to-many)
- Doctors → Patients (1-to-many)

## Functional Requirements

**Users:** Reception Staff, Hospital Administrators, Authorized Medical Staff

**Key Features:**
- Add, view, and delete patient records
- Schedule and cancel appointments
- Assign and track room availability
- Handle patient admissions

## Tech Stack
- **Database:** MySQL
- **Backend:** Java
- **Frontend:** React
- **IDE:** VS Code
- **Database Management:** MySQL Workbench

## Expected Outcomes
A fully functional hospital management application that efficiently handles patient records, appointments, and room assignments with accurate data handling.
