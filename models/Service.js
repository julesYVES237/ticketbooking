const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    prerequisites: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceType'
    },
    color: {
        type: String
    }
});

module.exports = {
    Service: mongoose.model('service', serviceSchema),
}
