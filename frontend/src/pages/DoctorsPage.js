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
  const [state, merge] = useMergeState({
    doctors: [
      {
        DoctorID: 1,
        DoctorName: "Dr. Smith",
        Specialty: "Cardiology",
        Phone: "555-1111",
        Email: "smith@hospital.com",
        DepartmentID: 1,
      },
    ],
    searchName: "",
    searchID: "",
    ...EMPTY_FORM,
    editingId: null,
  });

  const update = (key, value) => merge({ [key]: value });

  const addDoctor = () => {
    if (!state.DoctorID) return;
    merge({
      doctors: [
        ...state.doctors,
        {
          DoctorID: parseInt(state.DoctorID, 10),
          DoctorName: state.DoctorName,
          Specialty: state.Specialty,
          Phone: state.Phone,
          Email: state.Email,
          DepartmentID: state.DepartmentID ? parseInt(state.DepartmentID, 10) : null,
        },
      ],
      ...EMPTY_FORM,
    });
  };

  const deleteDoctor = (id) =>
    merge((s) => ({ doctors: s.doctors.filter((d) => d.DoctorID !== id) }));

  const startEdit = (doctor) =>
    merge({
      editingId: doctor.DoctorID,
      DoctorID: doctor.DoctorID,
      DoctorName: doctor.DoctorName,
      Specialty: doctor.Specialty,
      Phone: doctor.Phone,
      Email: doctor.Email,
      DepartmentID: doctor.DepartmentID || "",
    });

  const saveEdit = () => {
    if (!state.DoctorID) return;
    merge({
      doctors: state.doctors.map((d) =>
        d.DoctorID === state.editingId
          ? {
              DoctorID: parseInt(state.DoctorID, 10),
              DoctorName: state.DoctorName,
              Specialty: state.Specialty,
              Phone: state.Phone,
              Email: state.Email,
              DepartmentID: state.DepartmentID ? parseInt(state.DepartmentID, 10) : null,
            }
          : d
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

  const filtered = state.doctors.filter((d) => {
    const nameMatch = d.DoctorName.toLowerCase().includes(state.searchName.toLowerCase());
    const idMatch = d.DoctorID.toString().includes(state.searchID);
    return (state.searchName === "" || nameMatch) && (state.searchID === "" || idMatch);
  });

  return (
    <div>
      <h2>Doctors</h2>
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
        <button onClick={state.editingId ? saveEdit : addDoctor}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel
          </button>
        )}
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
            <tr key={d.DoctorID}>
              <td>{d.DoctorID}</td>
              <td>{d.DoctorName}</td>
              <td>{d.Specialty}</td>
              <td>{d.Phone}</td>
              <td>{d.Email}</td>
              <td>{d.DepartmentID}</td>
              <td>
                <button onClick={() => startEdit(d)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deleteDoctor(d.DoctorID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
