import React, { useState } from "react";
import "./Professor.css";

const Professor = () => {
  const [email, setEmail] = useState("");
  const [professor, setProfessor] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/get-professor-by-email", // This route handles email-based lookups
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }), // Send only the email
        }
      );
      const data = await response.json();
      if (data.professor) {
        setProfessor(data.professor);
        setPopupVisible(true);
        setMessage("");
      } else {
        setMessage("Professor not found.");
      }
    } catch (error) {
      setMessage("Error fetching professor: " + error.message);
    }
  };

  // Handle name submission and fetch lectures by professor name
  const handleNameSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/get-professor-lectures", // This route handles professorName-based lookups
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professorName: name }), // Send only the professor's name here
        }
      );
      const data = await response.json();
      if (data.lectures) {
        setLectures(data.lectures);
        setPopupVisible(false);
        setMessage("");
      } else {
        setMessage("No lectures found for this professor.");
      }
    } catch (error) {
      setMessage("Error fetching lectures: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Professor Lookup</h2>
      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Professor's Email"
          required
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {popupVisible && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Professor's Name"
            required
          />
          <button onClick={handleNameSubmit}>Submit Name</button>
        </div>
      )}

      {lectures.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Lectures of {name}</h3>
          <ul>
            {lectures.map((lecture) => (
              <li key={lecture._id}>
                {lecture.lecture} - {lecture.className}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Professor;
