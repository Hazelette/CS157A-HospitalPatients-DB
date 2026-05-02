import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  AppointmentID: "",
  PatientID: "",
  DoctorID: "",
  AppointmentDate: "",
  AppointmentTime: "",
  Status: "",
};

export function AppointmentsPage() {
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [scheduleFromDb, setScheduleFromDb] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState(null);

  const [state, merge] = useMergeState({
    appointments: [
      {
        AppointmentID: 1,
        PatientID: 1,
        DoctorID: 1,
        AppointmentDate: "2024-05-20",
        AppointmentTime: "10:00",
        Status: "Scheduled",
      },
    ],
    searchID: "",
    searchPatient: "",
    ...EMPTY_FORM,
    editingId: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setScheduleLoading(true);
      setScheduleError(null);
      try {
        const res = await fetch(`${API_BASE}/appointments`);
        if (!res.ok) throw new Error(`Could not load appointments (${res.status})`);
        const data = await res.json();
        if (!cancelled) setScheduleFromDb(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          setScheduleError(e.message || "Failed to fetch appointments.");
          setScheduleFromDb([]);
        }
      } finally {
        if (!cancelled) setScheduleLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const apptDay = (a) => String(a.appointmentDate ?? a.AppointmentDate ?? "").slice(0, 10);
  const apptTime = (a) => {
    const raw = a.appointmentTime ?? a.AppointmentTime;
    return raw == null || raw === "" ? "—" : String(raw).slice(0, 8);
  };

  const appointmentsForPickDate = scheduleFromDb
    .filter((a) => apptDay(a) === scheduleDate)
    .slice()
    .sort((a, b) => apptTime(a).localeCompare(apptTime(b)));

  const update = (key, value) => merge({ [key]: value });

  const addAppointment = () => {
    if (!state.AppointmentID) return;
    merge({
      appointments: [
        ...state.appointments,
        {
          AppointmentID: parseInt(state.AppointmentID, 10),
          PatientID: state.PatientID ? parseInt(state.PatientID, 10) : null,
          DoctorID: state.DoctorID ? parseInt(state.DoctorID, 10) : null,
          AppointmentDate: state.AppointmentDate,
          AppointmentTime: state.AppointmentTime,
          Status: state.Status,
        },
      ],
      ...EMPTY_FORM,
    });
  };

  const deleteAppointment = (id) =>
    merge((s) => ({ appointments: s.appointments.filter((a) => a.AppointmentID !== id) }));

  const startEdit = (appointment) =>
    merge({
      editingId: appointment.AppointmentID,
      AppointmentID: appointment.AppointmentID,
      PatientID: appointment.PatientID || "",
      DoctorID: appointment.DoctorID || "",
      AppointmentDate: appointment.AppointmentDate,
      AppointmentTime: appointment.AppointmentTime,
      Status: appointment.Status,
    });

  const saveEdit = () => {
    if (!state.AppointmentID) return;
    merge({
      appointments: state.appointments.map((a) =>
        a.AppointmentID === state.editingId
          ? {
              AppointmentID: parseInt(state.AppointmentID, 10),
              PatientID: state.PatientID ? parseInt(state.PatientID, 10) : null,
              DoctorID: state.DoctorID ? parseInt(state.DoctorID, 10) : null,
              AppointmentDate: state.AppointmentDate,
              AppointmentTime: state.AppointmentTime,
              Status: state.Status,
            }
          : a
      ),
      editingId: null,
      ...EMPTY_FORM,
    });
  };

  const cancelEdit = () =>
    merge({
      editingId: null,
      ...EMPTY_FORM,
    });

  const filtered = state.appointments.filter((a) => {
    const idMatch = a.AppointmentID.toString().includes(state.searchID);
    const patientMatch = a.PatientID.toString().includes(state.searchPatient);
    return (state.searchID === "" || idMatch) && (state.searchPatient === "" || patientMatch);
  });

  return (
    <div>
      <h2>Appointments</h2>

      <div className="appointments-schedule-preview">
        <h3 className="appointments-schedule-preview-title">Scheduled for date</h3>
        <p className="appointments-schedule-preview-hint">
          Pick a calendar day to list appointments from the database on that date (read-only).
        </p>
        <div className="appointments-schedule-preview-controls">
          <label className="appointments-schedule-date-label">
            Date
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </label>
        </div>
        {scheduleLoading && (
          <p className="appointments-schedule-preview-status">Loading schedule…</p>
        )}
        {!scheduleLoading && scheduleError && (
          <p className="appointments-schedule-preview-error">{scheduleError}</p>
        )}
        {!scheduleLoading && !scheduleError && appointmentsForPickDate.length === 0 && (
          <p className="appointments-schedule-preview-empty">No appointments on this date.</p>
        )}
        {!scheduleLoading && !scheduleError && appointmentsForPickDate.length > 0 && (
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
              {appointmentsForPickDate.map((a) => {
                const aid = a.appointmentID ?? a.AppointmentID;
                const pid = a.patientID ?? a.PatientID;
                const did = a.doctorID ?? a.DoctorID;
                const stat = a.status ?? a.Status;
                return (
                  <tr key={aid}>
                    <td>{aid}</td>
                    <td>{pid}</td>
                    <td>{did}</td>
                    <td>{apptTime(a)}</td>
                    <td>{stat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="search-bars">
        <input placeholder="Search by Appointment ID..." value={state.searchID} onChange={(e) => update("searchID", e.target.value)} />
        <input placeholder="Search by Patient ID..." value={state.searchPatient} onChange={(e) => update("searchPatient", e.target.value)} />
      </div>
      <div className="add-patient-form">
        <input placeholder="Appointment ID" value={state.AppointmentID} onChange={(e) => update("AppointmentID", e.target.value)} />
        <input placeholder="Patient ID" value={state.PatientID} onChange={(e) => update("PatientID", e.target.value)} />
        <input placeholder="Doctor ID" value={state.DoctorID} onChange={(e) => update("DoctorID", e.target.value)} />
        <input placeholder="Appointment Date" type="date" value={state.AppointmentDate} onChange={(e) => update("AppointmentDate", e.target.value)} />
        <input placeholder="Appointment Time" type="time" value={state.AppointmentTime} onChange={(e) => update("AppointmentTime", e.target.value)} />
        <input placeholder="Status" value={state.Status} onChange={(e) => update("Status", e.target.value)} />
        <button onClick={state.editingId ? saveEdit : addAppointment}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel
          </button>
        )}
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
            <tr key={a.AppointmentID}>
              <td>{a.AppointmentID}</td>
              <td>{a.PatientID}</td>
              <td>{a.DoctorID}</td>
              <td>{a.AppointmentDate}</td>
              <td>{a.AppointmentTime}</td>
              <td>{a.Status}</td>
              <td>
                <button onClick={() => startEdit(a)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deleteAppointment(a.AppointmentID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
