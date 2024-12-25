// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import AddProfessor from "./Components/AddProfessor/AddProfessor.jsx";
import AssignLecture from "./Components/AssignLecture/AssignLecture.jsx";
import SeeAllLectures from "./Components/AllLectures/SeeAllLectures.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-professor" element={<AddProfessor />} />
        <Route path="/assign-lecture" element={<AssignLecture />} />
        <Route path="/see-all-lectures" element={<SeeAllLectures />} />
      </Routes>
    </Router>
  );
};

export default App;
