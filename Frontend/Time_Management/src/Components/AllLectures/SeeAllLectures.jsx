import React, { useState, useEffect } from "react";

const SeeAllLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all lectures from the server
    const fetchLectures = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-all-lectures");
        const data = await response.json();
        if (response.ok) {
          setLectures(data.lectures);
        } else {
          setMessage(data.message || "Error fetching lectures.");
        }
      } catch (error) {
        setMessage("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>All Lectures</h2>
      {loading ? (
        <p>Loading lectures...</p>
      ) : message ? (
        <p style={{ color: "red" }}>{message}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Lecture</th>
              <th>Class</th>
              <th>Professor</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture) => (
              <tr key={lecture._id}>
                <td>{lecture.lecture}</td>
                <td>{lecture.className}</td>
                <td>{lecture.professorId.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SeeAllLectures;
