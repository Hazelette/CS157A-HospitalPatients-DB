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
  const [state, merge] = useMergeState({
    admissions: [
      {
        AdmissionID: 1,
        PatientID: 1,
        DoctorID: 1,
        RoomID: 1,
        AdmissionDate: "2024-05-15",
        DischargeDate: "2024-05-20",
        Diagnosis: "Flu",
      },
    ],
    searchID: "",
    searchPatient: "",
    ...EMPTY_FORM,
    editingId: null,
  });

  const update = (key, value) => merge({ [key]: value });

  const addAdmission = () => {
    if (!state.AdmissionID) return;
    merge({
      admissions: [
        ...state.admissions,
        {
          AdmissionID: parseInt(state.AdmissionID, 10),
          PatientID: state.PatientID ? parseInt(state.PatientID, 10) : null,
          DoctorID: state.DoctorID ? parseInt(state.DoctorID, 10) : null,
          RoomID: state.RoomID ? parseInt(state.RoomID, 10) : null,
          AdmissionDate: state.AdmissionDate,
          DischargeDate: state.DischargeDate,
          Diagnosis: state.Diagnosis,
        },
      ],
      ...EMPTY_FORM,
    });
  };

  const deleteAdmission = (id) =>
    merge((s) => ({ admissions: s.admissions.filter((a) => a.AdmissionID !== id) }));

  const startEdit = (admission) =>
    merge({
      editingId: admission.AdmissionID,
      AdmissionID: admission.AdmissionID,
      PatientID: admission.PatientID || "",
      DoctorID: admission.DoctorID || "",
      RoomID: admission.RoomID || "",
      AdmissionDate: admission.AdmissionDate,
      DischargeDate: admission.DischargeDate,
      Diagnosis: admission.Diagnosis,
    });

  const saveEdit = () => {
    if (!state.AdmissionID) return;
    merge({
      admissions: state.admissions.map((a) =>
        a.AdmissionID === state.editingId
          ? {
              AdmissionID: parseInt(state.AdmissionID, 10),
              PatientID: state.PatientID ? parseInt(state.PatientID, 10) : null,
              DoctorID: state.DoctorID ? parseInt(state.DoctorID, 10) : null,
              RoomID: state.RoomID ? parseInt(state.RoomID, 10) : null,
              AdmissionDate: state.AdmissionDate,
              DischargeDate: state.DischargeDate,
              Diagnosis: state.Diagnosis,
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

  const filtered = state.admissions.filter((a) => {
    const idMatch = a.AdmissionID.toString().includes(state.searchID);
    const patientMatch = a.PatientID.toString().includes(state.searchPatient);
    return (state.searchID === "" || idMatch) && (state.searchPatient === "" || patientMatch);
  });

  return (
    <div>
      <h2>Admissions</h2>
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
        <button onClick={state.editingId ? saveEdit : addAdmission}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel
          </button>
        )}
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.AdmissionID}>
              <td>{a.AdmissionID}</td>
              <td>{a.PatientID}</td>
              <td>{a.DoctorID}</td>
              <td>{a.RoomID}</td>
              <td>{a.AdmissionDate}</td>
              <td>{a.DischargeDate}</td>
              <td>{a.Diagnosis}</td>
              <td>
                <button onClick={() => startEdit(a)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deleteAdmission(a.AdmissionID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
