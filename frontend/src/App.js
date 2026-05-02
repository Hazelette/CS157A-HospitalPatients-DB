import { useState } from "react";
import "./App.css";
import {
  DashboardPage,
  PatientsPage,
  DoctorsPage,
  AppointmentsPage,
  AdmissionsPage,
  DepartmentsPage,
  RoomsPage,
} from "./pages";

function App() {
  const [entered, setEntered] = useState(false);
  const [fade, setFade] = useState(false);
  const [page, setPage] = useState("dashboard");

  const handleEnter = () => {
    setFade(true);
    setTimeout(() => {
      setEntered(true);
      setFade(false);
    }, 400);
  };

  const renderPage = () => {
    if (page === "dashboard") return <DashboardPage />;
    if (page === "patients") return <PatientsPage />;
    if (page === "doctors") return <DoctorsPage />;
    if (page === "appointments") return <AppointmentsPage />;
    if (page === "admissions") return <AdmissionsPage />;
    if (page === "departments") return <DepartmentsPage />;
    if (page === "rooms") return <RoomsPage />;
    return null;
  };

  if (!entered) {
    return (
      <div className={`home ${fade ? "fade-out" : ""}`}>
        <div className="card">
          <h1>Hospital Management System</h1>
          <p>Manage patient, doctor, and appointment information efficiently</p>
          <button type="button" onClick={handleEnter}>
            Enter System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app fade-in">
      <div className="sidebar">
        <h2>Hospital Management System</h2>
        <button type="button" onClick={() => setPage("dashboard")}>
          Dashboard
        </button>
        <button type="button" onClick={() => setPage("patients")}>
          Patients
        </button>
        <button type="button" onClick={() => setPage("doctors")}>
          Doctors
        </button>
        <button type="button" onClick={() => setPage("appointments")}>
          Appointments
        </button>
        <button type="button" onClick={() => setPage("admissions")}>
          Admissions
        </button>
        <button type="button" onClick={() => setPage("departments")}>
          Departments
        </button>
        <button type="button" onClick={() => setPage("rooms")}>
          Rooms
        </button>
        <button type="button" className="back-btn" onClick={() => setEntered(false)}>
          Back
        </button>
      </div>
      <div className="content">{renderPage()}</div>
    </div>
  );
}

export default App;
