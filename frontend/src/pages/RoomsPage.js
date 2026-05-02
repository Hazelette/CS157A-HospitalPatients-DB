import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";
import { useMergeState } from "../hooks/useMergeState";

export function RoomsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableRoomCount, setAvailableRoomCount] = useState(0);
  const [roomFreeCheckInput, setRoomFreeCheckInput] = useState("");
  const [roomFreeLookupQuery, setRoomFreeLookupQuery] = useState("");
  const [state, merge] = useMergeState({
    rooms: [],
    searchID: "",
    searchRoom: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [availRes, allRes] = await Promise.all([
          fetch(`${API_BASE}/rooms/available`),
          fetch(`${API_BASE}/rooms`),
        ]);
        if (!availRes.ok) throw new Error(`Available rooms request failed (${availRes.status})`);
        if (!allRes.ok) throw new Error(`All rooms request failed (${allRes.status})`);
        const availableList = await availRes.json();
        const allRooms = await allRes.json();
        if (!cancelled) {
          setAvailableRoomCount(Array.isArray(availableList) ? availableList.length : 0);
          merge({ rooms: Array.isArray(allRooms) ? allRooms : [] });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load rooms.");
          setAvailableRoomCount(0);
          merge({ rooms: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runRoomFreeLookup = () => setRoomFreeLookupQuery(roomFreeCheckInput.trim());

  const roomAvailabilityMessage = useMemo(() => {
    if (loading || error || roomFreeLookupQuery === "") return "";
    const match = state.rooms.find(
      (r) => String(r.roomNumber ?? "").toLowerCase() === roomFreeLookupQuery.toLowerCase()
    );
    if (!match) return `No room found with number "${roomFreeLookupQuery}".`;
    const available = String(match.availability ?? "").toLowerCase() === "available";
    return available
      ? `Room ${match.roomNumber} is free (available).`
      : `Room ${match.roomNumber} is not free (current status: ${match.availability || "-"})`;
  }, [loading, error, roomFreeLookupQuery, state.rooms]);

  const filtered = state.rooms.filter((r) => {
    const idMatch = String(r.roomID ?? "").includes(state.searchID);
    const roomMatch = String(r.roomNumber ?? "").includes(state.searchRoom);
    return (state.searchID === "" || idMatch) && (state.searchRoom === "" || roomMatch);
  });

  return (
    <div>
      <h2>Rooms</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && (
        <div className="rooms-live-panel">
          <h3 className="rooms-live-panel-title">Availability from database</h3>
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
          {roomAvailabilityMessage && <p className="rooms-live-panel-result">{roomAvailabilityMessage}</p>}
        </div>
      )}

      <div className="search-bars">
        <input placeholder="Search by ID..." value={state.searchID} onChange={(e) => merge({ searchID: e.target.value })} />
        <input placeholder="Search by room number..." value={state.searchRoom} onChange={(e) => merge({ searchRoom: e.target.value })} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Room Number</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.roomID}>
              <td>{r.roomID}</td>
              <td>{r.roomNumber}</td>
              <td>{r.availability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
