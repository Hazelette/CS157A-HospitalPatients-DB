import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  PatientID: "",
  FirstName: "",
  LastName: "",
  Gender: "",
  DateOfBirth: "",
  Phone: "",
  Address: "",
  BloodGroup: "",
};

export function PatientsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [state, merge] = useMergeState({
    patients: [],
    searchName: "",
    searchID: "",
    ...EMPTY_FORM,
  });

  const loadPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/patients`);
      if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
      const data = await res.json();
      merge({ patients: Array.isArray(data) ? data : [] });
    } catch (e) {
      setError(e.message || "Failed to load patients.");
      merge({ patients: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const update = (key, value) => merge({ [key]: value });

  const addPatient = async () => {
    if (!state.PatientID) return;
    setError("");
    try {
      const payload = {
        patientID: parseInt(state.PatientID, 10),
        firstName: state.FirstName,
        lastName: state.LastName,
        gender: state.Gender,
        dateOfBirth: state.DateOfBirth || null,
        phone: state.Phone,
        address: state.Address,
        bloodGroup: state.BloodGroup,
      };
      const res = await fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to create patient (${res.status})`);
      merge({ ...EMPTY_FORM });
      await loadPatients();
    } catch (e) {
      setError(e.message || "Failed to create patient.");
    }
  };

  const deletePatient = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Failed to delete patient (${res.status})`);
      }
      await loadPatients();
    } catch (e) {
      setError(e.message || "Failed to delete patient.");
    }
  };

  const filtered = state.patients.filter((p) => {
    const fullName = `${p.firstName ?? ""} ${p.lastName ?? ""}`.toLowerCase();
    const nameMatch = fullName.includes(state.searchName.toLowerCase());
    const idMatch = String(p.patientID ?? "").includes(state.searchID);
    return (state.searchName === "" || nameMatch) && (state.searchID === "" || idMatch);
  });

  return (
    <div>
      <h2>Patients</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      <div className="search-bars">
        <input
          placeholder="Search by name..."
          value={state.searchName}
          onChange={(e) => update("searchName", e.target.value)}
        />
        <input
          placeholder="Search by ID..."
          value={state.searchID}
          onChange={(e) => update("searchID", e.target.value)}
        />
      </div>

      <div className="add-patient-form">
        <input placeholder="Patient ID" value={state.PatientID} onChange={(e) => update("PatientID", e.target.value)} />
        <input placeholder="First Name" value={state.FirstName} onChange={(e) => update("FirstName", e.target.value)} />
        <input placeholder="Last Name" value={state.LastName} onChange={(e) => update("LastName", e.target.value)} />
        <input placeholder="Gender" value={state.Gender} onChange={(e) => update("Gender", e.target.value)} />
        <input placeholder="Date of Birth" type="date" value={state.DateOfBirth} onChange={(e) => update("DateOfBirth", e.target.value)} />
        <input placeholder="Phone" value={state.Phone} onChange={(e) => update("Phone", e.target.value)} />
        <input placeholder="Address" value={state.Address} onChange={(e) => update("Address", e.target.value)} />
        <input placeholder="Blood Group" value={state.BloodGroup} onChange={(e) => update("BloodGroup", e.target.value)} />
        <button onClick={addPatient}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Blood Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.patientID}>
              <td>{p.patientID}</td>
              <td>{p.firstName}</td>
              <td>{p.lastName}</td>
              <td>{p.gender}</td>
              <td>{p.dateOfBirth}</td>
              <td>{p.phone}</td>
              <td>{p.address}</td>
              <td>{p.bloodGroup}</td>
              <td>
                <button onClick={() => deletePatient(p.patientID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
