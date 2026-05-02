import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

const EMPTY_FORM = {
  RoomID: "",
  RoomNumber: "",
  Availability: "",
};

export function RoomsPage() {
  const [dbRoomsLoading, setDbRoomsLoading] = useState(true);
  const [dbRoomsError, setDbRoomsError] = useState(null);
  const [availableRoomCount, setAvailableRoomCount] = useState(0);
  const [allRoomsFromApi, setAllRoomsFromApi] = useState([]);
  const [roomFreeCheckInput, setRoomFreeCheckInput] = useState("");
  const [roomFreeLookupQuery, setRoomFreeLookupQuery] = useState("");

  const [state, merge] = useMergeState({
    rooms: [{ RoomID: 1, RoomNumber: "101", Availability: "Available" }],
    searchID: "",
    searchRoom: "",
    ...EMPTY_FORM,
    editingId: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDbRoomsLoading(true);
      setDbRoomsError(null);
      try {
        const [availRes, allRes] = await Promise.all([
          fetch(`${API_BASE}/rooms/available`),
          fetch(`${API_BASE}/rooms`),
        ]);
        if (!availRes.ok) throw new Error(`Available rooms (${availRes.status})`);
        if (!allRes.ok) throw new Error(`All rooms (${allRes.status})`);
        const availableList = await availRes.json();
        const everyRoom = await allRes.json();
        if (!cancelled) {
          setAvailableRoomCount(Array.isArray(availableList) ? availableList.length : 0);
          setAllRoomsFromApi(Array.isArray(everyRoom) ? everyRoom : []);
        }
      } catch (e) {
        if (!cancelled) {
          setDbRoomsError(e.message || "Failed to load rooms from database.");
          setAvailableRoomCount(0);
          setAllRoomsFromApi([]);
        }
      } finally {
        if (!cancelled) setDbRoomsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const roomNum = (r) => String(r?.roomNumber ?? r?.RoomNumber ?? "").trim();
  const roomAvail = (r) => String(r?.availability ?? r?.Availability ?? "").trim();

  const runRoomFreeLookup = () => {
    setRoomFreeLookupQuery(roomFreeCheckInput.trim());
  };

  let roomAvailabilityMessage = null;
  if (!dbRoomsLoading && !dbRoomsError && roomFreeLookupQuery !== "") {
    const lowerQ = roomFreeLookupQuery.toLowerCase();
    const match = allRoomsFromApi.find(
      (r) => roomNum(r).toLowerCase() === lowerQ
    );
    if (!match) {
      roomAvailabilityMessage = `No room found with number "${roomFreeLookupQuery}".`;
    } else {
      const num = roomNum(match);
      const av = roomAvail(match);
      const free = av.toLowerCase() === "available";
      roomAvailabilityMessage = free
        ? `Room ${num} is free (available).`
        : `Room ${num} is not free (current status: ${av || "—"}).`;
    }
  }

  const update = (key, value) => merge({ [key]: value });

  const addRoom = () => {
    if (!state.RoomID) return;
    merge({
      rooms: [
        ...state.rooms,
        {
          RoomID: parseInt(state.RoomID, 10),
          RoomNumber: state.RoomNumber,
          Availability: state.Availability,
        },
      ],
      ...EMPTY_FORM,
    });
  };

  const deleteRoom = (id) =>
    merge((s) => ({ rooms: s.rooms.filter((r) => r.RoomID !== id) }));

  const startEdit = (room) =>
    merge({
      editingId: room.RoomID,
      RoomID: room.RoomID,
      RoomNumber: room.RoomNumber,
      Availability: room.Availability,
    });

  const saveEdit = () => {
    if (!state.RoomID) return;
    merge({
      rooms: state.rooms.map((r) =>
        r.RoomID === state.editingId
          ? {
              RoomID: parseInt(state.RoomID, 10),
              RoomNumber: state.RoomNumber,
              Availability: state.Availability,
            }
          : r
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

  const filtered = state.rooms.filter((r) => {
    const idMatch = r.RoomID.toString().includes(state.searchID);
    const roomMatch = r.RoomNumber.includes(state.searchRoom);
    return (state.searchID === "" || idMatch) && (state.searchRoom === "" || roomMatch);
  });

  return (
    <div>
      <h2>Rooms</h2>

      <div className="rooms-live-panel">
        <h3 className="rooms-live-panel-title">Availability from database</h3>
        <p className="rooms-live-panel-hint">Current count of available rooms</p>
        {dbRoomsLoading && (
          <p className="rooms-live-panel-status">Loading room data…</p>
        )}
        {!dbRoomsLoading && dbRoomsError && (
          <p className="rooms-live-panel-error">{dbRoomsError}</p>
        )}
        {!dbRoomsLoading && !dbRoomsError && (
          <>
            <p className="rooms-live-panel-count">
              Available rooms now: <strong>{availableRoomCount}</strong>
            </p>
            <div className="rooms-live-panel-check">
              <label className="rooms-live-check-label">
                Room number
                <input
                  type="text"
                  placeholder="e.g. 101"
                  value={roomFreeCheckInput}
                  onChange={(e) => setRoomFreeCheckInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runRoomFreeLookup();
                  }}
                />
              </label>
              <button type="button" className="rooms-live-check-btn" onClick={runRoomFreeLookup}>
                Check if free
              </button>
            </div>
            {roomAvailabilityMessage && (
              <p className="rooms-live-panel-result">{roomAvailabilityMessage}</p>
            )}
          </>
        )}
      </div>

      <div className="search-bars">
        <input placeholder="Search by ID..." value={state.searchID} onChange={(e) => update("searchID", e.target.value)} />
        <input placeholder="Search by room number..." value={state.searchRoom} onChange={(e) => update("searchRoom", e.target.value)} />
      </div>
      <div className="add-patient-form">
        <input placeholder="Room ID" value={state.RoomID} onChange={(e) => update("RoomID", e.target.value)} />
        <input placeholder="Room Number" value={state.RoomNumber} onChange={(e) => update("RoomNumber", e.target.value)} />
        <input placeholder="Availability" value={state.Availability} onChange={(e) => update("Availability", e.target.value)} />
        <button onClick={state.editingId ? saveEdit : addRoom}>{state.editingId ? "Save" : "Add"}</button>
        {state.editingId && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel
          </button>
        )}
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
                <button onClick={() => startEdit(r)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deleteRoom(r.RoomID)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
