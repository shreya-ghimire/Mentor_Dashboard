const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateEvaluationPDF = (student, evaluation, filePath) => { // Add filePath parameter
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const pdfBuffer = [];

      doc.on('data', chunk => pdfBuffer.push(chunk));
      doc.on('end', () => {
        const pdfData = Buffer.concat(pdfBuffer);
        console.log("Generated PDF Content:", pdfData); // Log PDF content
        resolve(pdfData);
      });

      doc.fontSize(18).text(`Student Name: ${student.name}`);
      doc.fontSize(18).text(`Student Email: ${student.email}`);
      doc.fontSize(18).text(`Student ID: ${student._id}`);
      doc.fontSize(18).text(`Section: ${student.section}`);
      console.log(student.name, student.email, student._id, student.section);
      doc.moveDown();
      doc.fontSize(18).text('Evaluation Details:');
      doc.moveDown();

      doc.fontSize(18).text(`Ideation: ${evaluation.ideation}`);
      doc.fontSize(18).text(`Execution: ${evaluation.execution}`);
      doc.fontSize(18).text(`Viva Pitch: ${evaluation.viva_pitch}`);
      doc.fontSize(18).text(`Total Score: ${evaluation.total_score}`);
      console.log(evaluation.ideation, evaluation.execution, evaluation.viva_pitch, evaluation.total_score);

      const percentage = (evaluation.total_score / 30) * 100;
      doc.fontSize(18).text(`Percentage: ${percentage.toFixed(2)}%`);

      // Finish PDF generation
      doc.end();

      // Write PDF to the specified file path
      doc.pipe(fs.createWriteStream(filePath)); // Use provided file path
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateEvaluationPDF };
