import React, { useState, useEffect } from "react";

const AssignLecture = () => {
  const [professors, setProfessors] = useState([]);
  const [formData, setFormData] = useState({
    professorId: "",
    professorName: "",
    lecture: "",
    className: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-professors");
        const data = await response.json();
        setProfessors(data.professors);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/assign-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Lecture assigned successfully!");
      } else {
        setMessage(result.message || "Error assigning lecture.");
      }
    } catch (error) {
      setMessage("Error submitting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Assign Lecture</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Professor:</label>
          <select
            name="professorId"
            value={formData.professorId}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            <option value="">Select Professor</option>
            {professors.map((prof) => (
              <option key={prof._id} value={prof._id}>
                {prof.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Lecture:</label>
          <input
            type="text"
            name="lecture"
            value={formData.lecture}
            onChange={handleChange}
            required
            placeholder="Enter lecture name (e.g., Alpha, DSA)"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Class:</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            placeholder="Enter class name (e.g., CS-23)"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Assigning..." : "Assign Lecture"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
      )}
    </div>
  );
};

export default AssignLecture;
