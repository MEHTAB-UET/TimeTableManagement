import React, { useState } from "react";
import "./AddProfessor.css";

const AddProfessor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    qualification: "",
    experience: "",
    dateOfJoining: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(""); // Message for feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(""); // Reset any previous message

    try {
      const response = await fetch("http://localhost:5000/add-professor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(
          "Professor added successfully! A confirmation email has been sent."
        );
      } else {
        setMessage("Error adding professor. Please try again.");
      }
    } catch (error) {
      setMessage("Error submitting data: " + error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Add Professor</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Gmail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Qualification:</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Experience:</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Date Of Joining:</label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          style={{
            padding: "10px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"} {/* Show loading text */}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
      )}
    </div>
  );
};

export default AddProfessor;
