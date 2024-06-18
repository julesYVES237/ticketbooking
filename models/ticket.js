const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    isBooked: { 
        type: Boolean, 
        default: false 
    },
    reservedSeats: { 
        type: Number, 
        default: 0 
    },
    date: {
        type: Date, 
        default: Date.now 
    },
    departureTime: { 
        type: Date, 
        required: true 
    },
    arrivalTime: { 
        type: Date, 
        required: true 
    },
    passengerObj: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Passenger' 
    }
});

module.exports = {
    Ticket: mongoose.model('ticket', ticketSchema),
};
