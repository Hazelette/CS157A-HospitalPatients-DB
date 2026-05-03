import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  PatientID: "",
  DoctorID: "",
  AppointmentDate: "",
  AppointmentTime: "",
  Status: "Scheduled",
};

export function AppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [state, merge] = useMergeState({
    appointments: [],
    searchID: "",
    searchPatient: "",
    ...EMPTY_FORM,
  });

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/appointments`);
      if (!res.ok) throw new Error(`Failed to load appointments (${res.status})`);
      const data = await res.json();
      merge({ appointments: Array.isArray(data) ? data : [] });
    } catch (e) {
      setError(e.message || "Failed to load appointments.");
      merge({ appointments: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const update = (key, value) => merge({ [key]: value });

  const addAppointment = async () => {
    const pid = parseInt(state.PatientID, 10);
    const did = parseInt(state.DoctorID, 10);
    if (!state.AppointmentDate || !state.AppointmentTime || Number.isNaN(pid) || Number.isNaN(did)) {
      setError("Patient ID, Doctor ID, date, and time are required.");
      return;
    }
    setError("");
    try {
      // Do not send appointmentID — MySQL AUTO_INCREMENT assigns it; DAO returns the new row.
      const timeStr =
        state.AppointmentTime.length === 5 ? `${state.AppointmentTime}:00` : state.AppointmentTime;
      const payload = {
        patientID: pid,
        doctorID: did,
        appointmentDate: state.AppointmentDate,
        appointmentTime: timeStr,
        status: state.Status || "Scheduled",
      };
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to create appointment (${res.status})`);
      merge({ ...EMPTY_FORM });
      await loadAppointments();
    } catch (e) {
      setError(e.message || "Failed to create appointment.");
    }
  };

  const cancelAppointment = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, { method: "PUT" });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Failed to cancel appointment (${res.status})`);
      }
      await loadAppointments();
    } catch (e) {
      setError(e.message || "Failed to cancel appointment.");
    }
  };

  const filtered = state.appointments.filter((a) => {
    const idMatch = String(a.appointmentID ?? "").includes(state.searchID);
    const patientMatch = String(a.patientID ?? "").includes(state.searchPatient);
    return (state.searchID === "" || idMatch) && (state.searchPatient === "" || patientMatch);
  });

  const appointmentsForPickDate = useMemo(
    () =>
      state.appointments
        .filter((a) => String(a.appointmentDate ?? "").slice(0, 10) === scheduleDate)
        .slice()
        .sort((a, b) =>
          String(a.appointmentTime ?? "").localeCompare(String(b.appointmentTime ?? ""))
        ),
    [state.appointments, scheduleDate]
  );

  return (
    <div>
      <h2>Appointments</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}

      <div className="appointments-schedule-preview">
        <h3 className="appointments-schedule-preview-title">Scheduled for date</h3>
        <div className="appointments-schedule-preview-controls">
          <label className="appointments-schedule-date-label">
            Date
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
          </label>
        </div>
        {!loading && appointmentsForPickDate.length === 0 && <p>No appointments on this date.</p>}
        {!loading && appointmentsForPickDate.length > 0 && (
          <table className="appointments-schedule-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsForPickDate.map((a) => (
                <tr key={a.appointmentID}>
                  <td>{a.appointmentID}</td>
                  <td>{a.patientID}</td>
                  <td>{a.doctorID}</td>
                  <td>{String(a.appointmentTime ?? "").slice(0, 8)}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="search-bars">
        <input
          placeholder="Search by Appointment ID..."
          value={state.searchID}
          onChange={(e) => update("searchID", e.target.value)}
        />
        <input
          placeholder="Search by Patient ID..."
          value={state.searchPatient}
          onChange={(e) => update("searchPatient", e.target.value)}
        />
      </div>
      <div className="add-patient-form">
        <input placeholder="Patient ID" value={state.PatientID} onChange={(e) => update("PatientID", e.target.value)} />
        <input placeholder="Doctor ID" value={state.DoctorID} onChange={(e) => update("DoctorID", e.target.value)} />
        <input
          placeholder="Appointment Date"
          type="date"
          value={state.AppointmentDate}
          onChange={(e) => update("AppointmentDate", e.target.value)}
        />
        <input
          placeholder="Appointment Time"
          type="time"
          value={state.AppointmentTime}
          onChange={(e) => update("AppointmentTime", e.target.value)}
        />
        <input placeholder="Status" value={state.Status} onChange={(e) => update("Status", e.target.value)} />
        <button type="button" onClick={addAppointment}>
          Add
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.appointmentID}>
              <td>{a.appointmentID}</td>
              <td>{a.patientID}</td>
              <td>{a.doctorID}</td>
              <td>{a.appointmentDate}</td>
              <td>{String(a.appointmentTime ?? "").slice(0, 8)}</td>
              <td>{a.status}</td>
              <td>
                <button type="button" onClick={() => cancelAppointment(a.appointmentID)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
