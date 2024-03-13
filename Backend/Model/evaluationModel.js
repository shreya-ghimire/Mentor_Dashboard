const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evaluationSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },
    ideation: {
        type: Number,
        default: 0
    },
    execution: {
        type: Number,
        default: 0
    },
    viva_pitch: {
        type: Number,
        default: 0
    },
    total_score: {
        type: Number,
        default: 0
    },
    evaluation_locked: {
        type: Boolean,
        default: false
    }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
