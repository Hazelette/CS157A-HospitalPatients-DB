import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  DoctorID: "",
  DoctorName: "",
  Specialty: "",
  Phone: "",
  Email: "",
  DepartmentID: "",
};

export function DoctorsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [state, merge] = useMergeState({
    doctors: [],
    searchName: "",
    searchID: "",
    ...EMPTY_FORM,
  });

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      if (!res.ok) throw new Error(`Failed to load doctors (${res.status})`);
      const data = await res.json();
      merge({ doctors: Array.isArray(data) ? data : [] });
    } catch (e) {
      setError(e.message || "Failed to load doctors.");
      merge({ doctors: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const update = (key, value) => merge({ [key]: value });

  const addDoctor = async () => {
    if (!state.DoctorID) return;
    setError("");
    try {
      const payload = {
        doctorID: parseInt(state.DoctorID, 10),
        doctorName: state.DoctorName,
        specialty: state.Specialty,
        phone: state.Phone,
        email: state.Email,
        departmentID: state.DepartmentID ? parseInt(state.DepartmentID, 10) : null,
      };
      const res = await fetch(`${API_BASE}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to create doctor (${res.status})`);
      merge({ ...EMPTY_FORM });
      await loadDoctors();
    } catch (e) {
      setError(e.message || "Failed to create doctor.");
    }
  };

  const deleteDoctor = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Failed to delete doctor (${res.status})`);
      }
      await loadDoctors();
    } catch (e) {
      setError(e.message || "Failed to delete doctor.");
    }
  };

  const filtered = state.doctors.filter((d) => {
    const nameMatch = String(d.doctorName ?? "").toLowerCase().includes(state.searchName.toLowerCase());
    const idMatch = String(d.doctorID ?? "").includes(state.searchID);
    return (state.searchName === "" || nameMatch) && (state.searchID === "" || idMatch);
  });

  return (
    <div>
      <h2>Doctors</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      <div className="search-bars">
        <input placeholder="Search by name..." value={state.searchName} onChange={(e) => update("searchName", e.target.value)} />
        <input placeholder="Search by ID..." value={state.searchID} onChange={(e) => update("searchID", e.target.value)} />
      </div>
      <div className="add-patient-form">
        <input placeholder="Doctor ID" value={state.DoctorID} onChange={(e) => update("DoctorID", e.target.value)} />
        <input placeholder="Doctor Name" value={state.DoctorName} onChange={(e) => update("DoctorName", e.target.value)} />
        <input placeholder="Specialty" value={state.Specialty} onChange={(e) => update("Specialty", e.target.value)} />
        <input placeholder="Phone" value={state.Phone} onChange={(e) => update("Phone", e.target.value)} />
        <input placeholder="Email" value={state.Email} onChange={(e) => update("Email", e.target.value)} />
        <input placeholder="Department ID" value={state.DepartmentID} onChange={(e) => update("DepartmentID", e.target.value)} />
        <button onClick={addDoctor}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Specialty</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.doctorID}>
              <td>{d.doctorID}</td>
              <td>{d.doctorName}</td>
              <td>{d.specialty}</td>
              <td>{d.phone}</td>
              <td>{d.email}</td>
              <td>{d.departmentID}</td>
              <td>
                <button onClick={() => deleteDoctor(d.doctorID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
