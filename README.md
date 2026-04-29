# CS157A-HospitalPatients-DB
## Usage

### 1. Clone the Repository
```bash
git clone git@github.com:Hazelette/CS157A-HospitalPatients-DB.git
cd CS157A-HospitalPatients-DB
``` 
If SSH does not work, then use HTTPS
```base
git clone https://github.com/Hazelette/CS157A-HospitalPatients-DB.git
cd CS157A-HospitalPatients-DB
```

### 2. Database setup
Install MySQL if it's not already installed, and then create the database
```SQL
CREATE DATABASE hospital_db;
USE hospital_db;
```
Run schema & seed files
``` SQL
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 3. Frontend setup
To get started with the frontend after cloning:
```bash
cd frontend
npm install
npm start
```
The application will run on `http://localhost:3000`

### 4. Backend setup
Navigate to the backend directory:
```bash
cd backend/hospital
.\mvnw spring-boot:run
```

```Powershell
cd backend/hospital
./mvnw spring-boot:run
```
The application will run on `http://localhost:8080`

### 5. Notes
- Ensure MySQL is running before starting the backend
- Update database credentials in application.properties if needed
- Start the backend before using the frontend
- The frontend communicates with the backend via HTTP requests

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
- Doctors → Appointments (1-to-many)
- Doctors → Admissions (1-to-many)
- Doctors and Patients are related through Appointments and Admission

## Functional Requirements

**Users:** Reception Staff, Hospital Administrators, Authorized Medical Staff

**Key Features:**
- Add, view, and delete patient records
- Schedule and cancel appointments
- Assign and track room availability
- Handle patient admissions

## Tech Stack
- **Database:** MySQL
- **Backend:** Java (Spring Boot)
- **Frontend:** React
- **IDE:** VS Code
- **Database Management:** MySQL Workbench

## API Endpoints

### Patients
- **GET** `/patients` – Retrieve all patients  
- **POST** `/patients` – Add a new patient  
- **DELETE** `/patients/{id}` – Delete a patient by ID  

### Doctors
- **GET** `/doctors` – Retrieve all doctors  
- **POST** `/doctors` – Add a new doctor  
- **DELETE** `/doctors/{id}` – Delete a doctor by ID  
- **GET** `/doctors/department/{departmentID}` – Get doctors by department  

### Appointments
- **GET** `/appointments` – Retrieve all appointments  
- **POST** `/appointments` – Schedule a new appointment  
- **PUT** `/appointments/{id}/cancel` – Cancel an appointment  

### Rooms
- **GET** `/rooms` – Retrieve all rooms  
- **GET** `/rooms/available` – Retrieve available rooms  

### Admissions
- **GET** `/admissions` – Retrieve all admissions  
- **POST** `/admissions` – Add a new admission  

### Departments
- **GET** `/departments` – Retrieve all departments  
## Expected Outcomes
A fully functional hospital management application that efficiently handles patient records, appointments, and room assignments with accurate data handling.
