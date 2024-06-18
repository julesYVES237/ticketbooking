const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    humanresource_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Humanresource'
    },
    date: {
        type: Date,
        required: true
    },
    start_at: {
        type: Date,
        required: true
    },
    finish_at: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
});

// Méthode pour vérifier la disponibilité du créneau horaire
vacancySchema.statics.isSlotAvailable = async function(serviceId, date, startAt, finishAt) {
    const vacancy = await this.findOne({
        service_id: serviceId,
        date: date,
        start_at: { $lte: finishAt },
        finish_at: { $gte: startAt }
    });
    return !vacancy;
};

module.exports = mongoose.model('Vacancy', vacancySchema);
