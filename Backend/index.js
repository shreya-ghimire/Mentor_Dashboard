const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const Teacher = require('./Model/mentorModel');
const Student = require('./Model/studentModel');
const Evaluation = require('./Model/evaluationModel');
const fs = require('fs');
const { addEvaluationDataForAllStudents } = require('./evaluationController');
const { sendEmail } = require('./sendEmail');
const { generateEvaluationPDF } = require('./Pdf/generateEvaluationPDF');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose
  .connect('mongodb+srv://shreya:asdf@cluster1.jjrojry.mongodb.net/mentor_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Route for registering a mentor
app.post('/mentor', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = new Teacher({
      name,
      email,
      password: hashedPassword
    });

    await mentor.save();

    res.status(201).json({ message: 'Mentor registered successfully' });
  } catch (error) {
    console.error('Error registering mentor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for registering a student
app.post('/student', async (req, res) => {
  try {
    const { name, email, batch, section, project } = req.body;

    const lastStudent = await Student.findOne().sort({ student_id: -1 });

    let student_id;
    if (lastStudent) {
      student_id = parseInt(lastStudent.student_id) + 1;
    } else {
      student_id = 1;
    }

    const student = new Student({
      student_id,
      name,
      email,
      batch,
      section,
      project
    });

    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/evaluation', async (req, res) => {
  try {
    // Call the function to add evaluation data for all students
    await addEvaluationDataForAllStudents();

    const { student_id, teacher_id, ideation, execution, viva_pitch, total_score, evaluation_locked } = req.body;

    const evaluation = new Evaluation({
      student_id,
      teacher_id,
      ideation,
      execution,
      viva_pitch,
      total_score,
      evaluation_locked
    });

    await evaluation.save();

    res.status(201).json({ message: 'Evaluation submitted successfully' });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/send-email', async (req, res) => {
  const { studentEmail, totalScore } = req.body;

  try {
    await sendEmail(studentEmail, totalScore);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email' });
  }
});

const path = require('path');

app.post('/evaluate', async (req, res) => {
  try {
    const studentEmail = req.body.email;

    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const evaluation = await Evaluation.findOne({ student_id: student.student_id });

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    if (evaluation.evaluation_locked) {
      // Generate a unique file name (e.g., using timestamp)
      const fileName = `evaluation.pdf`;

      // Construct the file path relative to the 'download' directory
      const pdfFilePath = path.join(__dirname, fileName);

      // Generate the PDF with the specified file path
      const pdfData = await generateEvaluationPDF(student, evaluation, pdfFilePath);

      // No need to call savePDFtoFile function here

      // Set content disposition to attachment to force download
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.contentType('application/pdf');
      res.send(pdfData);
    } else {
      return res.status(403).json({ message: 'Evaluation is not locked' });
    }
  } catch (error) {
    console.error('Error processing evaluation form:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Function to save PDF data to a file
function savePDFtoFile(pdfData) {
  fs.writeFile('generated.pdf', pdfData, (err) => {
    if (err) {
      console.error('Error writing PDF file:', err);
    } else {
      console.log('PDF file saved successfully.');
    }
  });
}

app.put('/evaluation/assign', async (req, res) => {
  const { student_id, teacher_id } = req.body;
  console.log(req.body);

  try {
    let evaluation = await Evaluation.findOne({ student_id });

    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    evaluation.teacher_id = teacher_id;
    await evaluation.save();

    evaluation = await Evaluation.findById(evaluation._id);

    return res.status(200).json({ message: 'Teacher assigned successfully', data: evaluation });
  } catch (err) {
    console.error('Error assigning teacher to student:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/evaluation/update', async (req, res) => {
  try {
    const { student_id, ideation, execution, viva_pitch, total_score, evaluation_locked } = req.body;
    console.log(req.body);
    const evaluation = await Evaluation.findOneAndUpdate(
      { student_id: student_id },
      { ideation, execution, viva_pitch, total_score, evaluation_locked },
      { new: true }
    );

    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    res.json(evaluation);
  } catch (error) {
    console.error('Error updating evaluation form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/mentor', async (req, res) => {
  try {
    const mentors = await Teacher.find();
    res.status(200).json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/student', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/evaluation', async (req, res) => {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
