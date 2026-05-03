# CS157A-HospitalPatients-DB

## Usage

### 1. Clone the Repository
```bash
git clone git@github.com:Hazelette/CS157A-HospitalPatients-DB.git
cd CS157A-HospitalPatients-DB
```
If SSH does not work, then use HTTPS:
```bash
git clone https://github.com/Hazelette/CS157A-HospitalPatients-DB.git
cd CS157A-HospitalPatients-DB
```

### 2. Database setup
Install MySQL if it is not already installed, then run:
```sql
CREATE DATABASE hospital_db;
USE hospital_db;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 3. Backend setup
Start the backend first:
```powershell
cd backend/hospital
./mvnw spring-boot:run
```
The backend runs on `http://localhost:8080`.

### 4. Frontend setup
In a separate terminal, start the frontend:
```bash
cd frontend
npm install
npm start
```
The frontend runs on `http://localhost:3000`.

### 5. Run both services
This app requires both services running at the same time:
- Backend (Spring Boot) on `http://localhost:8080`
- Frontend (React) on `http://localhost:3000`

If either one is not running, frontend pages will show network/fetch errors.

### 6. Notes
- Ensure MySQL is running before starting the backend.
- Configure DB credentials with environment variables:
  - `DB_URL` (default: `jdbc:mysql://localhost:3306/hospital_db`)
  - `DB_USERNAME` (default: `root`)
  - `DB_PASSWORD` (default: empty)
- The frontend communicates with the backend via HTTP requests.

### 7. Docker (full stack)
Prerequisite: Docker Desktop must be installed and running.

You can run MySQL + backend + frontend together with Docker Compose:

Create a local env file first:
```bash
cp .env.example .env
```
```powershell
Copy-Item .env.example .env
```
Then edit `.env` and set a real `MYSQL_ROOT_PASSWORD`.

Run the following commands from the project root directory.

The first build may take several minutes.

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- MySQL: `localhost:3307` (password from your local `.env`)

MySQL is exposed on port `3307` to avoid conflicts with a local MySQL installation on port `3306`.

Stop containers:
```bash
docker compose down
```

Reset DB volume (fresh schema + seed on next up):
```bash
docker compose down -v
```

View container logs:
```bash
docker compose logs -f
```

### 8. Docker Troubleshooting

If something does not work on first run, try these fixes:

- Port already in use:
  - If `3000`, `8080`, or `3307` is already in use, stop the app using that port or change the port mapping in `docker-compose.yml`.

- Missing `.env` or missing password:
  - Ensure `.env` exists in the project root.
  - Ensure `MYSQL_ROOT_PASSWORD` is set in `.env`.

- Stale database volume / old seed data:
  - Recreate containers and volumes:
```bash
docker compose down -v
docker compose up --build
```

- Services started but UI still fails:
  - Check logs:
```bash
docker compose logs -f
```
  - Verify backend endpoint responds:
    - `http://localhost:8080/patients`

## Overview
Our project is a patient management system for hospitals that enables efficient tracking of patient locations, doctor-patient assignments, and appointment scheduling.

## Objectives
- Maintain accurate records of patients and scheduled appointments.
- Provide doctors with clear visibility of availability and patient details.
- Support common database operations (queries, inserts, updates).

## Database Schema

### Entities
- Patients: `PatientID`, `FirstName`, `LastName`, `Gender`, `DateOfBirth`, `Phone`, `Address`, `BloodGroup`
- Doctors: `DoctorID`, `DoctorName`, `Specialty`, `Phone`, `Email`, `DepartmentID`
- Departments: `DepartmentID`, `DepartmentName`, `Location`
- Appointments: `AppointmentID`, `PatientID`, `DoctorID`, `AppointmentDate`, `AppointmentTime`, `Status`
- Admissions: `AdmissionID`, `PatientID`, `DoctorID`, `RoomID`, `AdmissionDate`, `DischargeDate`, `Diagnosis`
- Rooms: `RoomID`, `RoomNumber`, `Availability`

### Relationships
- Department -> Doctors (1-to-many)
- Patients -> Appointments (1-to-many)
- Doctors -> Appointments (1-to-many)
- Patients -> Admissions (1-to-many)
- Rooms -> Admissions (1-to-many)
- Doctors -> Admissions (1-to-many)

## Functional Requirements

### Users
- Reception Staff
- Hospital Administrators
- Authorized Medical Staff

### Key Features
- Add, view, and delete patient records
- Schedule and cancel appointments
- Assign and track room availability
- Handle patient admissions

## Tech Stack
- Database: MySQL
- Backend: Java (Spring Boot)
- Frontend: React
- IDE: VS Code
- Database Management: MySQL Workbench

## API Endpoints

### Patients
- `GET /patients` - Retrieve all patients
- `POST /patients` - Add a new patient
- `DELETE /patients/{id}` - Delete a patient by ID

### Doctors
- `GET /doctors` - Retrieve all doctors
- `POST /doctors` - Add a new doctor
- `DELETE /doctors/{id}` - Delete a doctor by ID
- `GET /doctors/department/{departmentID}` - Get doctors by department

### Appointments
- `GET /appointments` - Retrieve all appointments
- `POST /appointments` - Schedule a new appointment
- `PUT /appointments/{id}/cancel` - Cancel an appointment

### Rooms
- `GET /rooms` - Retrieve all rooms
- `GET /rooms/available` - Retrieve available rooms

### Admissions
- `GET /admissions` - Retrieve all admissions
- `POST /admissions` - Add a new admission

### Departments
- `GET /departments` - Retrieve all departments

## Expected Outcomes
A fully functional hospital management application that efficiently handles patient records, appointments, and room assignments with accurate data handling.
