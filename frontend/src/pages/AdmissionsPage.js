import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  AdmissionID: "",
  PatientID: "",
  DoctorID: "",
  RoomID: "",
  AdmissionDate: "",
  DischargeDate: "",
  Diagnosis: "",
};

export function AdmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [state, merge] = useMergeState({
    admissions: [],
    searchID: "",
    searchPatient: "",
    ...EMPTY_FORM,
  });

  const loadAdmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admissions`);
      if (!res.ok) throw new Error(`Failed to load admissions (${res.status})`);
      const data = await res.json();
      merge({ admissions: Array.isArray(data) ? data : [] });
    } catch (e) {
      setError(e.message || "Failed to load admissions.");
      merge({ admissions: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissions();
  }, []);

  const update = (key, value) => merge({ [key]: value });

  const addAdmission = async () => {
    if (!state.AdmissionID) return;
    setError("");
    try {
      const payload = {
        admissionID: parseInt(state.AdmissionID, 10),
        patientID: state.PatientID ? parseInt(state.PatientID, 10) : null,
        doctorID: state.DoctorID ? parseInt(state.DoctorID, 10) : null,
        roomID: state.RoomID ? parseInt(state.RoomID, 10) : null,
        admissionDate: state.AdmissionDate || null,
        dischargeDate: state.DischargeDate || null,
        diagnosis: state.Diagnosis,
      };
      const res = await fetch(`${API_BASE}/admissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to create admission (${res.status})`);
      merge({ ...EMPTY_FORM });
      await loadAdmissions();
    } catch (e) {
      setError(e.message || "Failed to create admission.");
    }
  };

  const filtered = state.admissions.filter((a) => {
    const idMatch = String(a.admissionID ?? "").includes(state.searchID);
    const patientMatch = String(a.patientID ?? "").includes(state.searchPatient);
    return (state.searchID === "" || idMatch) && (state.searchPatient === "" || patientMatch);
  });

  return (
    <div>
      <h2>Admissions</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      <div className="search-bars">
        <input placeholder="Search by Admission ID..." value={state.searchID} onChange={(e) => update("searchID", e.target.value)} />
        <input placeholder="Search by Patient ID..." value={state.searchPatient} onChange={(e) => update("searchPatient", e.target.value)} />
      </div>
      <div className="add-patient-form">
        <input placeholder="Admission ID" value={state.AdmissionID} onChange={(e) => update("AdmissionID", e.target.value)} />
        <input placeholder="Patient ID" value={state.PatientID} onChange={(e) => update("PatientID", e.target.value)} />
        <input placeholder="Doctor ID" value={state.DoctorID} onChange={(e) => update("DoctorID", e.target.value)} />
        <input placeholder="Room ID" value={state.RoomID} onChange={(e) => update("RoomID", e.target.value)} />
        <input placeholder="Admission Date" type="date" value={state.AdmissionDate} onChange={(e) => update("AdmissionDate", e.target.value)} />
        <input placeholder="Discharge Date" type="date" value={state.DischargeDate} onChange={(e) => update("DischargeDate", e.target.value)} />
        <input placeholder="Diagnosis" value={state.Diagnosis} onChange={(e) => update("Diagnosis", e.target.value)} />
        <button onClick={addAdmission}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Admission ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Room ID</th>
            <th>Admission Date</th>
            <th>Discharge Date</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.admissionID}>
              <td>{a.admissionID}</td>
              <td>{a.patientID}</td>
              <td>{a.doctorID}</td>
              <td>{a.roomID}</td>
              <td>{a.admissionDate}</td>
              <td>{a.dischargeDate}</td>
              <td>{a.diagnosis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
