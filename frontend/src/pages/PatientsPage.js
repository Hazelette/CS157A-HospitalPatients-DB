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
  const [state, merge] = useMergeState({
    patients: [
      {
        PatientID: 1,
        FirstName: "John",
        LastName: "Doe",
        Gender: "Male",
        DateOfBirth: "1994-05-15",
        Phone: "555-1234",
        Address: "123 Main St",
        BloodGroup: "O+",
      },
    ],
    searchName: "",
    searchID: "",
    ...EMPTY_FORM,
    editingId: null,
  });

  const update = (key, value) => merge({ [key]: value });

  const addPatient = () => {
    if (!state.PatientID) return;
    merge({
      patients: [
        ...state.patients,
        {
          PatientID: parseInt(state.PatientID, 10),
          FirstName: state.FirstName,
          LastName: state.LastName,
          Gender: state.Gender,
          DateOfBirth: state.DateOfBirth,
          Phone: state.Phone,
          Address: state.Address,
          BloodGroup: state.BloodGroup,
        },
      ],
      ...EMPTY_FORM,
    });
  };

  const deletePatient = (id) =>
    merge((s) => ({ patients: s.patients.filter((p) => p.PatientID !== id) }));

  const startEdit = (patient) =>
    merge({
      editingId: patient.PatientID,
      PatientID: patient.PatientID,
      FirstName: patient.FirstName,
      LastName: patient.LastName,
      Gender: patient.Gender,
      DateOfBirth: patient.DateOfBirth,
      Phone: patient.Phone,
      Address: patient.Address,
      BloodGroup: patient.BloodGroup,
    });

  const saveEdit = () => {
    if (!state.PatientID) return;
    merge({
      patients: state.patients.map((p) =>
        p.PatientID === state.editingId
          ? {
              PatientID: parseInt(state.PatientID, 10),
              FirstName: state.FirstName,
              LastName: state.LastName,
              Gender: state.Gender,
              DateOfBirth: state.DateOfBirth,
              Phone: state.Phone,
              Address: state.Address,
              BloodGroup: state.BloodGroup,
            }
          : p
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

  const filtered = state.patients.filter((p) => {
    const nameMatch = `${p.FirstName} ${p.LastName}`
      .toLowerCase()
      .includes(state.searchName.toLowerCase());
    const idMatch = p.PatientID.toString().includes(state.searchID);
    return (state.searchName === "" || nameMatch) && (state.searchID === "" || idMatch);
  });

  return (
    <div>
      <h2>Patients</h2>

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
        <button onClick={state.editingId ? saveEdit : addPatient}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel
          </button>
        )}
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
            <tr key={p.PatientID}>
              <td>{p.PatientID}</td>
              <td>{p.FirstName}</td>
              <td>{p.LastName}</td>
              <td>{p.Gender}</td>
              <td>{p.DateOfBirth}</td>
              <td>{p.Phone}</td>
              <td>{p.Address}</td>
              <td>{p.BloodGroup}</td>
              <td>
                <button onClick={() => startEdit(p)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deletePatient(p.PatientID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
