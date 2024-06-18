const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    }
});

module.exports = {
    ServiceType: mongoose.model('serviceType', serviceTypeSchema),
}
