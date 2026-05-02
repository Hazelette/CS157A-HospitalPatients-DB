import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  DepartmentID: "",
  DepartmentName: "",
  Location: "",
};

export function DepartmentsPage() {
  const [state, merge] = useMergeState({
    departments: [{ DepartmentID: 1, DepartmentName: "Cardiology", Location: "Building A" }],
    searchID: "",
    searchName: "",
    ...EMPTY_FORM,
    editingId: null,
  });

  const update = (key, value) => merge({ [key]: value });

  const addDepartment = () => {
    if (!state.DepartmentID) return;
    merge({
      departments: [
        ...state.departments,
        {
          DepartmentID: parseInt(state.DepartmentID, 10),
          DepartmentName: state.DepartmentName,
          Location: state.Location,
        },
      ],
      ...EMPTY_FORM,
    });
  };

  const deleteDepartment = (id) =>
    merge((s) => ({ departments: s.departments.filter((d) => d.DepartmentID !== id) }));

  const startEdit = (department) =>
    merge({
      editingId: department.DepartmentID,
      DepartmentID: department.DepartmentID,
      DepartmentName: department.DepartmentName,
      Location: department.Location,
    });

  const saveEdit = () => {
    if (!state.DepartmentID) return;
    merge({
      departments: state.departments.map((d) =>
        d.DepartmentID === state.editingId
          ? {
              DepartmentID: parseInt(state.DepartmentID, 10),
              DepartmentName: state.DepartmentName,
              Location: state.Location,
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

  const filtered = state.departments.filter((d) => {
    const idMatch = d.DepartmentID.toString().includes(state.searchID);
    const nameMatch = d.DepartmentName.toLowerCase().includes(state.searchName.toLowerCase());
    return (state.searchID === "" || idMatch) && (state.searchName === "" || nameMatch);
  });

  return (
    <div>
      <h2>Departments</h2>
      <div className="search-bars">
        <input placeholder="Search by ID..." value={state.searchID} onChange={(e) => update("searchID", e.target.value)} />
        <input placeholder="Search by name..." value={state.searchName} onChange={(e) => update("searchName", e.target.value)} />
      </div>
      <div className="add-patient-form">
        <input placeholder="Department ID" value={state.DepartmentID} onChange={(e) => update("DepartmentID", e.target.value)} />
        <input placeholder="Department Name" value={state.DepartmentName} onChange={(e) => update("DepartmentName", e.target.value)} />
        <input placeholder="Location" value={state.Location} onChange={(e) => update("Location", e.target.value)} />
        <button onClick={state.editingId ? saveEdit : addDepartment}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.DepartmentID}>
              <td>{d.DepartmentID}</td>
              <td>{d.DepartmentName}</td>
              <td>{d.Location}</td>
              <td>
                <button onClick={() => startEdit(d)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deleteDepartment(d.DepartmentID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
