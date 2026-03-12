import React, { useMemo, useState } from "react";
import {
  INITIAL_MOVIES,
  CINEMAS,
  INITIAL_ROOMS,
  INITIAL_SHOWTIMES,
} from "../store/mockData";

const containerStyle = {
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  color: "#1f2937",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "8px",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
};

const primaryButton = {
  ...buttonStyle,
  background: "#2563eb",
  color: "#fff",
};

const secondaryButton = {
  ...buttonStyle,
  background: "#e5e7eb",
  color: "#111827",
};

const dangerButton = {
  ...buttonStyle,
  background: "#dc2626",
  color: "#fff",
};

const warningButton = {
  ...buttonStyle,
  background: "#f59e0b",
  color: "#fff",
};

const smallButton = {
  ...buttonStyle,
  padding: "8px 12px",
  fontSize: "13px",
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function toDatetimeLocalValue(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

function formatDateTime(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "Không hợp lệ";
  return date.toLocaleString("vi-VN");
}

function sameDay(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getEndTime(startTime, durationMinutes) {
  return new Date(new Date(startTime).getTime() + durationMinutes * 60000);
}

const Showtime = () => {
  const [showtimes, setShowtimes] = useState(() =>
    INITIAL_SHOWTIMES.map((item) => {
      const room = INITIAL_ROOMS.find((r) => r.id === item.roomId);
      return {
        ...item,
        cinemaId: room?.cinemaId || item.cinemaId,
      };
    })
  );

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    movieId: "",
    cinemaId: "",
    date: "",
  });

  const [form, setForm] = useState({
    movieId: INITIAL_MOVIES[0]?.id || "",
    cinemaId: CINEMAS[0]?.id || "",
    roomId: "",
    startTime: "",
    price: "",
  });

  const availableRooms = useMemo(() => {
    return INITIAL_ROOMS.filter((room) => room.cinemaId === form.cinemaId);
  }, [form.cinemaId]);

  const selectedMovie = useMemo(() => {
    return INITIAL_MOVIES.find((movie) => movie.id === form.movieId);
  }, [form.movieId]);

  const selectedRoom = useMemo(() => {
    return INITIAL_ROOMS.find((room) => room.id === form.roomId);
  }, [form.roomId]);

  const previewEndTime = useMemo(() => {
    if (!form.startTime || !selectedMovie) return "";
    return getEndTime(form.startTime, selectedMovie.duration);
  }, [form.startTime, selectedMovie]);

  const enrichedShowtimes = useMemo(() => {
    return showtimes.map((showtime) => {
      const movie = INITIAL_MOVIES.find((m) => m.id === showtime.movieId);
      const room = INITIAL_ROOMS.find((r) => r.id === showtime.roomId);
      const cinema = CINEMAS.find((c) => c.id === (room?.cinemaId || showtime.cinemaId));
      const endTime = movie
        ? getEndTime(showtime.startTime, movie.duration)
        : new Date(showtime.startTime);

      return {
        ...showtime,
        movie,
        room,
        cinema,
        endTime,
      };
    });
  }, [showtimes]);

  const filteredShowtimes = useMemo(() => {
    return enrichedShowtimes
      .filter((item) => {
        const keyword = filters.keyword.trim().toLowerCase();
        if (!keyword) return true;

        const movieTitle = item.movie?.title?.toLowerCase() || "";
        const cinemaName = item.cinema?.name?.toLowerCase() || "";
        const roomName = item.room?.name?.toLowerCase() || "";

        return (
          movieTitle.includes(keyword) ||
          cinemaName.includes(keyword) ||
          roomName.includes(keyword)
        );
      })
      .filter((item) => (filters.movieId ? item.movieId === filters.movieId : true))
      .filter((item) => (filters.cinemaId ? item.cinema?.id === filters.cinemaId : true))
      .filter((item) => {
        if (!filters.date) return true;
        return sameDay(item.startTime, filters.date);
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [enrichedShowtimes, filters]);

  const resetForm = () => {
    setForm({
      movieId: INITIAL_MOVIES[0]?.id || "",
      cinemaId: CINEMAS[0]?.id || "",
      roomId: "",
      startTime: "",
      price: "",
    });
    setEditingId(null);
    setError("");
  };

  const handleCinemaChange = (cinemaId) => {
    setForm((prev) => ({
      ...prev,
      cinemaId,
      roomId: "",
    }));
  };

  const validateConflict = (candidate) => {
    const candidateMovie = INITIAL_MOVIES.find((m) => m.id === candidate.movieId);
    const candidateStart = new Date(candidate.startTime);
    const candidateEnd = getEndTime(candidate.startTime, candidateMovie.duration);

    return showtimes.some((existing) => {
      if (editingId && existing.id === editingId) return false;
      if (existing.roomId !== candidate.roomId) return false;

      const existingMovie = INITIAL_MOVIES.find((m) => m.id === existing.movieId);
      if (!existingMovie) return false;

      const existingStart = new Date(existing.startTime);
      const existingEnd = getEndTime(existing.startTime, existingMovie.duration);

      return candidateStart < existingEnd && candidateEnd > existingStart;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.movieId || !form.cinemaId || !form.roomId || !form.startTime || !form.price) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (Number(form.price) <= 0) {
      setError("Giá vé phải lớn hơn 0.");
      return;
    }

    const room = INITIAL_ROOMS.find((r) => r.id === form.roomId);
    if (!room) {
      setError("Phòng chiếu không hợp lệ.");
      return;
    }

    const newShowtime = {
      id: editingId || `s${Date.now()}`,
      movieId: form.movieId,
      cinemaId: room.cinemaId,
      roomId: form.roomId,
      startTime: new Date(form.startTime).toISOString(),
      price: Number(form.price),
    };

    if (validateConflict(newShowtime)) {
      setError("Suất chiếu bị trùng giờ với một suất khác trong cùng phòng.");
      return;
    }

    if (editingId) {
      setShowtimes((prev) =>
        prev.map((item) => (item.id === editingId ? newShowtime : item))
      );
    } else {
      setShowtimes((prev) => [...prev, newShowtime]);
    }

    resetForm();
  };

  const handleEdit = (showtime) => {
    const room = INITIAL_ROOMS.find((r) => r.id === showtime.roomId);

    setEditingId(showtime.id);
    setForm({
      movieId: showtime.movieId,
      cinemaId: room?.cinemaId || showtime.cinemaId || "",
      roomId: showtime.roomId,
      startTime: toDatetimeLocalValue(showtime.startTime),
      price: String(showtime.price),
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa suất chiếu này không?");
    if (!confirmed) return;

    setShowtimes((prev) => prev.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>Quản lý suất chiếu</h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Thêm, sửa, xóa lịch chiếu phim bằng mock data.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>
            {editingId ? "Chỉnh sửa suất chiếu" : "Thêm suất chiếu mới"}
          </h2>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "16px",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>Phim</label>
                <select
                  style={inputStyle}
                  value={form.movieId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, movieId: e.target.value }))
                  }
                >
                  {INITIAL_MOVIES.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.duration} phút)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Rạp</label>
                <select
                  style={inputStyle}
                  value={form.cinemaId}
                  onChange={(e) => handleCinemaChange(e.target.value)}
                >
                  <option value="">Chọn rạp</option>
                  {CINEMAS.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Phòng chiếu</label>
                <select
                  style={inputStyle}
                  value={form.roomId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, roomId: e.target.value }))
                  }
                >
                  <option value="">Chọn phòng</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Thời gian bắt đầu</label>
                <input
                  style={inputStyle}
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Giá vé cơ bản</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="1000"
                  placeholder="Ví dụ: 90000"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Giờ kết thúc dự kiến</label>
                <input
                  style={{ ...inputStyle, background: "#f3f4f6" }}
                  type="text"
                  readOnly
                  value={previewEndTime ? formatDateTime(previewEndTime) : ""}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "18px", flexWrap: "wrap" }}>
              <button type="submit" style={primaryButton}>
                {editingId ? "Cập nhật suất chiếu" : "Thêm suất chiếu"}
              </button>
              <button type="button" style={secondaryButton} onClick={resetForm}>
                Làm mới form
              </button>
            </div>
          </form>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Bộ lọc</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Tìm kiếm</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Tên phim, rạp, phòng..."
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Lọc theo phim</label>
              <select
                style={inputStyle}
                value={filters.movieId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, movieId: e.target.value }))
                }
              >
                <option value="">Tất cả phim</option>
                {INITIAL_MOVIES.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Lọc theo rạp</label>
              <select
                style={inputStyle}
                value={filters.cinemaId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, cinemaId: e.target.value }))
                }
              >
                <option value="">Tất cả rạp</option>
                {CINEMAS.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Lọc theo ngày</label>
              <input
                style={inputStyle}
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>Danh sách suất chiếu</h2>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              Tổng: <strong>{filteredShowtimes.length}</strong> suất chiếu
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "950px",
              }}
            >
              <thead>
                <tr style={{ background: "#eff6ff" }}>
                  <th style={thStyle}>Phim</th>
                  <th style={thStyle}>Rạp</th>
                  <th style={thStyle}>Phòng</th>
                  <th style={thStyle}>Bắt đầu</th>
                  <th style={thStyle}>Kết thúc</th>
                  <th style={thStyle}>Giá vé</th>
                  <th style={thStyle}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredShowtimes.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={7}>
                      Không có suất chiếu nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredShowtimes.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>{item.movie?.title || "Không rõ"}</td>
                      <td style={tdStyle}>{item.cinema?.name || "Không rõ"}</td>
                      <td style={tdStyle}>{item.room?.name || "Không rõ"}</td>
                      <td style={tdStyle}>{formatDateTime(item.startTime)}</td>
                      <td style={tdStyle}>{formatDateTime(item.endTime)}</td>
                      <td style={tdStyle}>{formatCurrency(item.price)}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            style={{ ...warningButton, ...smallButton }}
                            onClick={() => handleEdit(item)}
                          >
                            Sửa
                          </button>
                          <button
                            style={{ ...dangerButton, ...smallButton }}
                            onClick={() => handleDelete(item.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "14px 12px",
  borderBottom: "1px solid #dbeafe",
  fontSize: "14px",
  color: "#1e3a8a",
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  verticalAlign: "top",
};

export default Showtime;