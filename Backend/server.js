const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Initialize the app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI =
  "mongodb+srv://CN_User:Kiahal1122@Mehtab2046.m6bmv.mongodb.net/CN_User?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Professor schema and model
const professorSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  qualification: String,
  experience: String,
  dateOfJoining: Date,
});

const Professor = mongoose.model("Professor", professorSchema);

// Lecture schema with start time and end time
const lectureSchema = new mongoose.Schema({
  lecture: String,
  className: String,
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: "Professor" },
  professorName: String,
  startTime: String,
  endTime: String,
});

const Lecture = mongoose.model("Lecture", lectureSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mehtabatkips@gmail.com", // Replace with your email
    pass: "tdgn vbuu qcqu htip", // Replace with your email password or app password
  },
});

// POST route to add a professor
app.post("/add-professor", async (req, res) => {
  const { name, email, age, qualification, experience, dateOfJoining } =
    req.body;

  try {
    // Save professor to database
    const newProfessor = new Professor({
      name,
      email,
      age,
      qualification,
      experience,
      dateOfJoining,
    });

    await newProfessor.save();

    // Send confirmation email to the professor
    const mailOptions = {
      from: "mehtabatkips@gmail.com",
      to: email,
      subject: "Welcome to University of Engineering and Technology Lahore",
      text: `Dear ${name},\n\nYou have been successfully added as a professor at the University of Engineering and Technology Lahore.\n\nBest Regards,\nUET Lahore`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email." });
      }
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({ message: "Professor added successfully!" });
  } catch (error) {
    console.error("Error adding professor:", error);
    res.status(500).json({ message: "Error adding professor." });
  }
});
// Route to assign a lecture to a professor
app.post("/assign-lecture", async (req, res) => {
  const { professorId, lecture, className, startTime, endTime } = req.body;

  try {
    // Find professor to get name
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    // Check if the same lecture is already assigned to another professor for the same class at the same time
    const overlappingLecture = await Lecture.findOne({
      className,
      startTime,
      endTime,
    });
    if (overlappingLecture) {
      return res.status(400).json({
        message: `A lecture is already assigned for class ${className} during the selected time.`,
      });
    }

    // Assign lecture to the professor
    const newLecture = new Lecture({
      lecture,
      className,
      professorId,
      professorName: professor.name, // Store the professor's name
      startTime,
      endTime,
    });
    await newLecture.save();

    // Send email to the professor
    const mailOptions = {
      from: "mehtabatkips@gmail.com",
      to: professor.email,
      subject: `Lecture Assignment: ${lecture}`,
      text: `Dear ${professor.name},\n\nYou have been assigned the ${lecture} lecture for class ${className} from ${startTime} to ${endTime}.\n\nBest Regards,\nUniversity of Engineering and Technology Lahore`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
    });

    res.status(200).json({ message: "Lecture assigned successfully!" });
  } catch (error) {
    console.error("Error assigning lecture:", error);
    res.status(500).json({ message: "Error assigning lecture." });
  }
});

// Route to get all professors
app.get("/get-professors", async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json({ professors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching professors." });
  }
});

// Route to get all lectures with professor details
app.get("/get-all-lectures", async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("professorId", "name") // Populate professor name
      .exec();
    res.json({ lectures });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ message: "Error fetching lectures." });
  }
});

// Route to get professor lectures by email
app.post("/get-professor-lectures", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the professor by email
    const professor = await Professor.findOne({ email });

    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    // Fetch the lectures associated with the professor
    const lectures = await Lecture.find({ professor: professor._id });

    if (lectures.length === 0) {
      return res
        .status(404)
        .json({ message: "No lectures found for this professor." });
    }

    res.json({ lectures });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lectures." });
  }
});

// Route to get professor lectures by name

// Route to get professor by email
app.post("/get-professor-by-email", async (req, res) => {
  const { email } = req.body;
  try {
    const professor = await Professor.findOne({ email });
    if (professor) {
      res.json({ professor });
    } else {
      res.status(404).json({ message: "Professor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching professor." });
  }
});

// Route to get all lectures for the professor
app.post("/get-professor-lectures", async (req, res) => {
  const { email, name } = req.body;
  try {
    const professor = await Professor.findOne({ email, name });
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    const lectures = await Lecture.find({ professorId: professor._id });
    res.json({ lectures });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lectures." });
  }
});
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

// Route to get professor by email
app.post("/get-professor-by-email", async (req, res) => {
  const { email } = req.body;
  try {
    const professor = await Professor.findOne({ email });
    if (professor) {
      res.json({ professor });
    } else {
      res.status(404).json({ message: "Professor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching professor." });
  }
});
// Route to get all lectures for the professor by professorName
app.post("/get-professor-lectures", async (req, res) => {
  const { professorName } = req.body;
  try {
    const lectures = await Lecture.find({ professorName });
    if (lectures.length === 0) {
      return res
        .status(404)
        .json({ message: "No lectures found for this professor" });
    }
    res.json({ lectures });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lectures." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
