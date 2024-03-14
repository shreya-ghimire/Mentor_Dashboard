const Evaluation = require('./Model/evaluationModel');
const Student = require('./Model/studentModel');

async function addEvaluationDataForAllStudents() {
  try {
    const students = await Student.find();


    students.forEach(async (student) => {
      try {

        const existingEvaluation = await Evaluation.findOne({ student_id: student.student_id });

        // If evaluation entry doesn't exist, create a new one
        if (!existingEvaluation) {
          const newEvaluation = new Evaluation({
            student_id: student.student_id,
            teacher_id: 0, 
            ideation: 0,
            execution: 0,
            viva_pitch: 0,
            total_score: 0,
            evaluation_locked: false
          });

          // Save the new evaluation entry
          await newEvaluation.save();
        }
      } catch (error) {
        console.error(`Error adding evaluation data for student with ID ${student.student_id}:`, error);
      }
    });

    console.log('Evaluation data added for all students.');
  } catch (error) {
    console.error('Error retrieving students:', error);
  }
}

module.exports = {
  addEvaluationDataForAllStudents
};
