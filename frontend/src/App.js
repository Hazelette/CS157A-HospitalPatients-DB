import { useState } from "react";
import "./App.css";

function App() {
  // State
  const [entered, setEntered] = useState(false);
  const [fade, setFade] = useState(false);
  const [page, setPage] = useState("dashboard");

  // Handlers
  const handleEnter = () => {
    setFade(true);
    setTimeout(() => {
      setEntered(true);
      setFade(false);
    }, 400);
  };

//===========

  // Page Rendering
  const renderDashboard = () => (
    <div>
      <h2>Dashboard</h2>
      <div className="card-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>smt</p>
        </div>
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p>numberrr</p>
        </div>
        <div className="stat-card">
          <h3>Appointments Today</h3>
          <p>implementnum</p>
        </div>
        <div className="stat-card">
          <h3>Available Rooms</h3>
          <p>implementnum</p>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (page === "dashboard") return renderDashboard();
    if (page === "patients") return <h2>Patients Page</h2>;
    if (page === "doctors") return <h2>Doctors Page</h2>;
    if (page === "appointments") return <h2>Appointments Page</h2>;
    if (page === "rooms") return <h2>Rooms Page</h2>;
  };

  // Landing Page
  if (!entered) {
    return (
      <div className={`home ${fade ? "fade-out" : ""}`}>
        <div className="card">
          <h1>Hospital Management System</h1>
          <p>Manage patient, doctor, and appointment information efficiently</p>
          <button onClick={handleEnter}>Enter System</button>
        </div>
      </div>
    );
  }

//===========

  //Main Dashboard Layout
  return (
    <div className="app fade-in">
      <div className="sidebar">
        <h2>Hospital Management System</h2>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("patients")}>Patients</button>
        <button onClick={() => setPage("doctors")}>Doctors</button>
        <button onClick={() => setPage("appointments")}>Appointments</button>
        <button onClick={() => setPage("rooms")}>Rooms</button>
        <button className="back-btn" onClick={() => setEntered(false)}>
          Back
        </button>
      </div>
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
}



export default App;