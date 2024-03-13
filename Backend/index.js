const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Teacher = require('./Model/mentorModel');
const Student = require('./Model/studentModel');
const Evaluation = require('./Model/evaluationModel');

const app = express();
const PORT = 5000;


app.use(express.json()); 
app.use(cors()); 


mongoose.connect('mongodb+srv://shreya:asdf@cluster1.jjrojry.mongodb.net/mentor_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


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


app.post('/student', async (req, res) => {
  try {
    const { student_id, name, email, batch, section, project } = req.body;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
