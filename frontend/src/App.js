import { useState } from "react";
import "./App.css";

function App() {
  // State
  const [entered, setEntered] = useState(false);
  const [fade, setFade] = useState(false);
  const [page, setPage] = useState("dashboard");

  // Handlers
  const handleEnter = () => {
    setFade(true);
    setTimeout(() => {
      setEntered(true);
      setFade(false);
    }, 400);
  };

//===========

  // Page Rendering
  const renderDashboard = () => (
    <div>
      <h2>Dashboard</h2>
      <div className="card-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>smt</p>
        </div>
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p>numberrr</p>
        </div>
        <div className="stat-card">
          <h3>Appointments Today</h3>
          <p>implementnum</p>
        </div>
        <div className="stat-card">
          <h3>Available Rooms</h3>
          <p>implementnum</p>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (page === "dashboard") return renderDashboard();
    if (page === "patients") return <PatientsPage />;
    if (page === "doctors") return <DoctorsPage />;
    if (page === "appointments") return <AppointmentsPage />;
    if (page === "admissions") return <AdmissionsPage />;
    if (page === "departments") return <DepartmentsPage />;
    if (page === "rooms") return <RoomsPage />;
  };

  // Landing Page
  if (!entered) {
    return (
      <div className={`home ${fade ? "fade-out" : ""}`}>
        <div className="card">
          <h1>Hospital Management System</h1>
          <p>Manage patient, doctor, and appointment information efficiently</p>
          <button onClick={handleEnter}>Enter System</button>
        </div>
      </div>
    );
  }

//===========

  //Main Dashboard Layout
  return (
    <div className="app fade-in">
      <div className="sidebar">
        <h2>Hospital Management System</h2>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("patients")}>Patients</button>
        <button onClick={() => setPage("doctors")}>Doctors</button>
        <button onClick={() => setPage("appointments")}>Appointments</button>
        <button onClick={() => setPage("admissions")}>Admissions</button>
        <button onClick={() => setPage("departments")}>Departments</button>
        <button onClick={() => setPage("rooms")}>Rooms</button>
        <button className="back-btn" onClick={() => setEntered(false)}>
          Back
        </button>
      </div>
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
}



//---------------------------------

function PatientsPage() {
  const [state, setState] = useState({
    patients: [
      { 
        PatientID: 1, 
        FirstName: "John", 
        LastName: "Doe", 
        Gender: "Male", 
        DateOfBirth: "1994-05-15",
        Phone: "555-1234",
        Address: "123 Main St",
        BloodGroup: "O+"
      },
    ],
    searchName: "",
    searchID: "",
    PatientID: "",
    FirstName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    Phone: "",
    Address: "",
    BloodGroup: "",
    editingId: null,
  });

  const update = (key, value) =>
    setState({ ...state, [key]: value });

  const addPatient = () => {
    if (!state.PatientID) return;

    setState({
      ...state,
      patients: [
        ...state.patients,
        {
          PatientID: parseInt(state.PatientID),
          FirstName: state.FirstName,
          LastName: state.LastName,
          Gender: state.Gender,
          DateOfBirth: state.DateOfBirth,
          Phone: state.Phone,
          Address: state.Address,
          BloodGroup: state.BloodGroup,
        },
      ],
      PatientID: "",
      FirstName: "",
      LastName: "",
      Gender: "",
      DateOfBirth: "",
      Phone: "",
      Address: "",
      BloodGroup: "",
    });
  };

  const deletePatient = (id) =>
    update(
      "patients",
      state.patients.filter((p) => p.PatientID !== id)
    );

  const startEdit = (patient) => {
    setState({
      ...state,
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
  };

  const saveEdit = () => {
    if (!state.PatientID) return;

    setState({
      ...state,
      patients: state.patients.map((p) =>
        p.PatientID === state.editingId
          ? {
              PatientID: parseInt(state.PatientID),
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
      PatientID: "",
      FirstName: "",
      LastName: "",
      Gender: "",
      DateOfBirth: "",
      Phone: "",
      Address: "",
      BloodGroup: "",
    });
  };

  const cancelEdit = () => {
    setState({
      ...state,
      editingId: null,
      PatientID: "",
      FirstName: "",
      LastName: "",
      Gender: "",
      DateOfBirth: "",
      Phone: "",
      Address: "",
      BloodGroup: "",
    });
  };

  const filtered = state.patients.filter((p) => {
    const nameMatch = `${p.FirstName} ${p.LastName}`.toLowerCase().includes(state.searchName.toLowerCase());
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
        <input
          placeholder="Patient ID"
          value={state.PatientID}
          onChange={(e) => update("PatientID", e.target.value)}
        />
        <input
          placeholder="First Name"
          value={state.FirstName}
          onChange={(e) => update("FirstName", e.target.value)}
        />
        <input
          placeholder="Last Name"
          value={state.LastName}
          onChange={(e) => update("LastName", e.target.value)}
        />
        <input
          placeholder="Gender"
          value={state.Gender}
          onChange={(e) => update("Gender", e.target.value)}
        />
        <input
          placeholder="Date of Birth"
          type="date"
          value={state.DateOfBirth}
          onChange={(e) => update("DateOfBirth", e.target.value)}
        />
        <input
          placeholder="Phone"
          value={state.Phone}
          onChange={(e) => update("Phone", e.target.value)}
        />
        <input
          placeholder="Address"
          value={state.Address}
          onChange={(e) => update("Address", e.target.value)}
        />
        <input
          placeholder="Blood Group"
          value={state.BloodGroup}
          onChange={(e) => update("BloodGroup", e.target.value)}
        />
        <button onClick={state.editingId ? saveEdit : addPatient}>
          {state.editingId ? "Save" : "Add"}
        </button>
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
                <button
                  onClick={() => startEdit(p)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button onClick={() => deletePatient(p.PatientID)}>
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DoctorsPage() {
  const [state, setState] = useState({
    doctors: [
      { DoctorID: 1, DoctorName: "Dr. Smith", Specialty: "Cardiology", Phone: "555-1111", Email: "smith@hospital.com", DepartmentID: 1 },
    ],
    searchName: "",
    searchID: "",
    DoctorID: "",
    DoctorName: "",
    Specialty: "",
    Phone: "",
    Email: "",
    DepartmentID: "",
    editingId: null,
  });

  const update = (key, value) =>
    setState({ ...state, [key]: value });

  const addDoctor = () => {
    if (!state.DoctorID) return;

    setState({
      ...state,
      doctors: [
        ...state.doctors,
        {
          DoctorID: parseInt(state.DoctorID),
          DoctorName: state.DoctorName,
          Specialty: state.Specialty,
          Phone: state.Phone,
          Email: state.Email,
          DepartmentID: state.DepartmentID ? parseInt(state.DepartmentID) : null,
        },
      ],
      DoctorID: "",
      DoctorName: "",
      Specialty: "",
      Phone: "",
      Email: "",
      DepartmentID: "",
    });
  };

  const deleteDoctor = (id) =>
    update("doctors", state.doctors.filter((d) => d.DoctorID !== id));

  const startEdit = (doctor) => {
    setState({
      ...state,
      editingId: doctor.DoctorID,
      DoctorID: doctor.DoctorID,
      DoctorName: doctor.DoctorName,
      Specialty: doctor.Specialty,
      Phone: doctor.Phone,
      Email: doctor.Email,
      DepartmentID: doctor.DepartmentID || "",
    });
  };

  const saveEdit = () => {
    if (!state.DoctorID) return;

    setState({
      ...state,
      doctors: state.doctors.map((d) =>
        d.DoctorID === state.editingId
          ? {
              DoctorID: parseInt(state.DoctorID),
              DoctorName: state.DoctorName,
              Specialty: state.Specialty,
              Phone: state.Phone,
              Email: state.Email,
              DepartmentID: state.DepartmentID ? parseInt(state.DepartmentID) : null,
            }
          : d
      ),
      editingId: null,
      DoctorID: "",
      DoctorName: "",
      Specialty: "",
      Phone: "",
      Email: "",
      DepartmentID: "",
    });
  };

  const cancelEdit = () => {
    setState({
      ...state,
      editingId: null,
      DoctorID: "",
      DoctorName: "",
      Specialty: "",
      Phone: "",
      Email: "",
      DepartmentID: "",
    });
  };

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
        {state.editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
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
                <button onClick={() => startEdit(d)} className="edit-btn">Edit</button>
                <button onClick={() => deleteDoctor(d.DoctorID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AppointmentsPage() {
  const [state, setState] = useState({
    appointments: [
      { AppointmentID: 1, PatientID: 1, DoctorID: 1, AppointmentDate: "2024-05-20", AppointmentTime: "10:00", Status: "Scheduled" },
    ],
    searchID: "",
    searchPatient: "",
    AppointmentID: "",
    PatientID: "",
    DoctorID: "",
    AppointmentDate: "",
    AppointmentTime: "",
    Status: "",
    editingId: null,
  });

  const update = (key, value) =>
    setState({ ...state, [key]: value });

  const addAppointment = () => {
    if (!state.AppointmentID) return;

    setState({
      ...state,
      appointments: [
        ...state.appointments,
        {
          AppointmentID: parseInt(state.AppointmentID),
          PatientID: state.PatientID ? parseInt(state.PatientID) : null,
          DoctorID: state.DoctorID ? parseInt(state.DoctorID) : null,
          AppointmentDate: state.AppointmentDate,
          AppointmentTime: state.AppointmentTime,
          Status: state.Status,
        },
      ],
      AppointmentID: "",
      PatientID: "",
      DoctorID: "",
      AppointmentDate: "",
      AppointmentTime: "",
      Status: "",
    });
  };

  const deleteAppointment = (id) =>
    update("appointments", state.appointments.filter((a) => a.AppointmentID !== id));

  const startEdit = (appointment) => {
    setState({
      ...state,
      editingId: appointment.AppointmentID,
      AppointmentID: appointment.AppointmentID,
      PatientID: appointment.PatientID || "",
      DoctorID: appointment.DoctorID || "",
      AppointmentDate: appointment.AppointmentDate,
      AppointmentTime: appointment.AppointmentTime,
      Status: appointment.Status,
    });
  };

  const saveEdit = () => {
    if (!state.AppointmentID) return;

    setState({
      ...state,
      appointments: state.appointments.map((a) =>
        a.AppointmentID === state.editingId
          ? {
              AppointmentID: parseInt(state.AppointmentID),
              PatientID: state.PatientID ? parseInt(state.PatientID) : null,
              DoctorID: state.DoctorID ? parseInt(state.DoctorID) : null,
              AppointmentDate: state.AppointmentDate,
              AppointmentTime: state.AppointmentTime,
              Status: state.Status,
            }
          : a
      ),
      editingId: null,
      AppointmentID: "",
      PatientID: "",
      DoctorID: "",
      AppointmentDate: "",
      AppointmentTime: "",
      Status: "",
    });
  };

  const cancelEdit = () => {
    setState({
      ...state,
      editingId: null,
      AppointmentID: "",
      PatientID: "",
      DoctorID: "",
      AppointmentDate: "",
      AppointmentTime: "",
      Status: "",
    });
  };

  const filtered = state.appointments.filter((a) => {
    const idMatch = a.AppointmentID.toString().includes(state.searchID);
    const patientMatch = a.PatientID.toString().includes(state.searchPatient);
    return (state.searchID === "" || idMatch) && (state.searchPatient === "" || patientMatch);
  });

  return (
    <div>
      <h2>Appointments</h2>
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
        {state.editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
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
                <button onClick={() => startEdit(a)} className="edit-btn">Edit</button>
                <button onClick={() => deleteAppointment(a.AppointmentID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdmissionsPage() {
  const [state, setState] = useState({
    admissions: [
      { AdmissionID: 1, PatientID: 1, DoctorID: 1, RoomID: 1, AdmissionDate: "2024-05-15", DischargeDate: "2024-05-20", Diagnosis: "Flu" },
    ],
    searchID: "",
    searchPatient: "",
    AdmissionID: "",
    PatientID: "",
    DoctorID: "",
    RoomID: "",
    AdmissionDate: "",
    DischargeDate: "",
    Diagnosis: "",
    editingId: null,
  });

  const update = (key, value) =>
    setState({ ...state, [key]: value });

  const addAdmission = () => {
    if (!state.AdmissionID) return;

    setState({
      ...state,
      admissions: [
        ...state.admissions,
        {
          AdmissionID: parseInt(state.AdmissionID),
          PatientID: state.PatientID ? parseInt(state.PatientID) : null,
          DoctorID: state.DoctorID ? parseInt(state.DoctorID) : null,
          RoomID: state.RoomID ? parseInt(state.RoomID) : null,
          AdmissionDate: state.AdmissionDate,
          DischargeDate: state.DischargeDate,
          Diagnosis: state.Diagnosis,
        },
      ],
      AdmissionID: "",
      PatientID: "",
      DoctorID: "",
      RoomID: "",
      AdmissionDate: "",
      DischargeDate: "",
      Diagnosis: "",
    });
  };

  const deleteAdmission = (id) =>
    update("admissions", state.admissions.filter((a) => a.AdmissionID !== id));

  const startEdit = (admission) => {
    setState({
      ...state,
      editingId: admission.AdmissionID,
      AdmissionID: admission.AdmissionID,
      PatientID: admission.PatientID || "",
      DoctorID: admission.DoctorID || "",
      RoomID: admission.RoomID || "",
      AdmissionDate: admission.AdmissionDate,
      DischargeDate: admission.DischargeDate,
      Diagnosis: admission.Diagnosis,
    });
  };

  const saveEdit = () => {
    if (!state.AdmissionID) return;

    setState({
      ...state,
      admissions: state.admissions.map((a) =>
        a.AdmissionID === state.editingId
          ? {
              AdmissionID: parseInt(state.AdmissionID),
              PatientID: state.PatientID ? parseInt(state.PatientID) : null,
              DoctorID: state.DoctorID ? parseInt(state.DoctorID) : null,
              RoomID: state.RoomID ? parseInt(state.RoomID) : null,
              AdmissionDate: state.AdmissionDate,
              DischargeDate: state.DischargeDate,
              Diagnosis: state.Diagnosis,
            }
          : a
      ),
      editingId: null,
      AdmissionID: "",
      PatientID: "",
      DoctorID: "",
      RoomID: "",
      AdmissionDate: "",
      DischargeDate: "",
      Diagnosis: "",
    });
  };

  const cancelEdit = () => {
    setState({
      ...state,
      editingId: null,
      AdmissionID: "",
      PatientID: "",
      DoctorID: "",
      RoomID: "",
      AdmissionDate: "",
      DischargeDate: "",
      Diagnosis: "",
    });
  };

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
        {state.editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
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
                <button onClick={() => startEdit(a)} className="edit-btn">Edit</button>
                <button onClick={() => deleteAdmission(a.AdmissionID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DepartmentsPage() {
  const [state, setState] = useState({
    departments: [
      { DepartmentID: 1, DepartmentName: "Cardiology", Location: "Building A" },
    ],
    searchID: "",
    searchName: "",
    DepartmentID: "",
    DepartmentName: "",
    Location: "",
    editingId: null,
  });

  const update = (key, value) =>
    setState({ ...state, [key]: value });

  const addDepartment = () => {
    if (!state.DepartmentID) return;

    setState({
      ...state,
      departments: [
        ...state.departments,
        {
          DepartmentID: parseInt(state.DepartmentID),
          DepartmentName: state.DepartmentName,
          Location: state.Location,
        },
      ],
      DepartmentID: "",
      DepartmentName: "",
      Location: "",
    });
  };

  const deleteDepartment = (id) =>
    update("departments", state.departments.filter((d) => d.DepartmentID !== id));

  const startEdit = (department) => {
    setState({
      ...state,
      editingId: department.DepartmentID,
      DepartmentID: department.DepartmentID,
      DepartmentName: department.DepartmentName,
      Location: department.Location,
    });
  };

  const saveEdit = () => {
    if (!state.DepartmentID) return;

    setState({
      ...state,
      departments: state.departments.map((d) =>
        d.DepartmentID === state.editingId
          ? {
              DepartmentID: parseInt(state.DepartmentID),
              DepartmentName: state.DepartmentName,
              Location: state.Location,
            }
          : d
      ),
      editingId: null,
      DepartmentID: "",
      DepartmentName: "",
      Location: "",
    });
  };

  const cancelEdit = () => {
    setState({
      ...state,
      editingId: null,
      DepartmentID: "",
      DepartmentName: "",
      Location: "",
    });
  };

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
        {state.editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
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
                <button onClick={() => startEdit(d)} className="edit-btn">Edit</button>
                <button onClick={() => deleteDepartment(d.DepartmentID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoomsPage() {
  const [state, setState] = useState({
    rooms: [
      { RoomID: 1, RoomNumber: "101", Availability: "Available" },
    ],
    searchID: "",
    searchRoom: "",
    RoomID: "",
    RoomNumber: "",
    Availability: "",
    editingId: null,
  });

  const update = (key, value) =>
    setState({ ...state, [key]: value });

  const addRoom = () => {
    if (!state.RoomID) return;

    setState({
      ...state,
      rooms: [
        ...state.rooms,
        {
          RoomID: parseInt(state.RoomID),
          RoomNumber: state.RoomNumber,
          Availability: state.Availability,
        },
      ],
      RoomID: "",
      RoomNumber: "",
      Availability: "",
    });
  };

  const deleteRoom = (id) =>
    update("rooms", state.rooms.filter((r) => r.RoomID !== id));

  const startEdit = (room) => {
    setState({
      ...state,
      editingId: room.RoomID,
      RoomID: room.RoomID,
      RoomNumber: room.RoomNumber,
      Availability: room.Availability,
    });
  };

  const saveEdit = () => {
    if (!state.RoomID) return;

    setState({
      ...state,
      rooms: state.rooms.map((r) =>
        r.RoomID === state.editingId
          ? {
              RoomID: parseInt(state.RoomID),
              RoomNumber: state.RoomNumber,
              Availability: state.Availability,
            }
          : r
      ),
      editingId: null,
      RoomID: "",
      RoomNumber: "",
      Availability: "",
    });
  };

  const cancelEdit = () => {
    setState({
      ...state,
      editingId: null,
      RoomID: "",
      RoomNumber: "",
      Availability: "",
    });
  };

  const filtered = state.rooms.filter((r) => {
    const idMatch = r.RoomID.toString().includes(state.searchID);
    const roomMatch = r.RoomNumber.includes(state.searchRoom);
    return (state.searchID === "" || idMatch) && (state.searchRoom === "" || roomMatch);
  });

  return (
    <div>
      <h2>Rooms</h2>
      <div className="search-bars">
        <input placeholder="Search by ID..." value={state.searchID} onChange={(e) => update("searchID", e.target.value)} />
        <input placeholder="Search by room number..." value={state.searchRoom} onChange={(e) => update("searchRoom", e.target.value)} />
      </div>
      <div className="add-patient-form">
        <input placeholder="Room ID" value={state.RoomID} onChange={(e) => update("RoomID", e.target.value)} />
        <input placeholder="Room Number" value={state.RoomNumber} onChange={(e) => update("RoomNumber", e.target.value)} />
        <input placeholder="Availability" value={state.Availability} onChange={(e) => update("Availability", e.target.value)} />
        <button onClick={state.editingId ? saveEdit : addRoom}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
      </div>
      <table>
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Room Number</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.RoomID}>
              <td>{r.RoomID}</td>
              <td>{r.RoomNumber}</td>
              <td>{r.Availability}</td>
              <td>
                <button onClick={() => startEdit(r)} className="edit-btn">Edit</button>
                <button onClick={() => deleteRoom(r.RoomID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;