import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

export function DepartmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [state, merge] = useMergeState({
    departments: [],
    searchID: "",
    searchName: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/departments`);
        if (!res.ok) throw new Error(`Failed to load departments (${res.status})`);
        const data = await res.json();
        if (!cancelled) merge({ departments: Array.isArray(data) ? data : [] });
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load departments.");
          merge({ departments: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = state.departments.filter((d) => {
    const idMatch = String(d.departmentID ?? "").includes(state.searchID);
    const nameMatch = String(d.departmentName ?? "").toLowerCase().includes(state.searchName.toLowerCase());
    return (state.searchID === "" || idMatch) && (state.searchName === "" || nameMatch);
  });

  return (
    <div>
      <h2>Departments</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      <div className="search-bars">
        <input placeholder="Search by ID..." value={state.searchID} onChange={(e) => merge({ searchID: e.target.value })} />
        <input placeholder="Search by name..." value={state.searchName} onChange={(e) => merge({ searchName: e.target.value })} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.departmentID}>
              <td>{d.departmentID}</td>
              <td>{d.departmentName}</td>
              <td>{d.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
