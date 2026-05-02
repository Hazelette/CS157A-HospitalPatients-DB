import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    appointmentsToday: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const today = new Date().toISOString().slice(0, 10);
        const [patientsRes, doctorsRes, appointmentsRes, availableRoomsRes] = await Promise.all([
          fetch(`${API_BASE}/patients`),
          fetch(`${API_BASE}/doctors`),
          fetch(`${API_BASE}/appointments`),
          fetch(`${API_BASE}/rooms/available`),
        ]);
        if (!patientsRes.ok || !doctorsRes.ok || !appointmentsRes.ok || !availableRoomsRes.ok) {
          throw new Error("One or more dashboard API requests failed.");
        }
        const [patients, doctors, appointments, availableRooms] = await Promise.all([
          patientsRes.json(),
          doctorsRes.json(),
          appointmentsRes.json(),
          availableRoomsRes.json(),
        ]);
        const appointmentsToday = (Array.isArray(appointments) ? appointments : []).filter(
          (a) => String(a.appointmentDate ?? "").slice(0, 10) === today
        ).length;
        if (!cancelled) {
          setStats({
            totalPatients: Array.isArray(patients) ? patients.length : 0,
            totalDoctors: Array.isArray(doctors) ? doctors.length : 0,
            appointmentsToday,
            availableRooms: Array.isArray(availableRooms) ? availableRooms.length : 0,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load dashboard stats.");
          setStats({
            totalPatients: 0,
            totalDoctors: 0,
            appointmentsToday: 0,
            availableRooms: 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      <div className="card-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p>{stats.totalDoctors}</p>
        </div>
        <div className="stat-card">
          <h3>Appointments Today</h3>
          <p>{stats.appointmentsToday}</p>
        </div>
        <div className="stat-card">
          <h3>Available Rooms</h3>
          <p>{stats.availableRooms}</p>
        </div>
      </div>
    </div>
  );
}
