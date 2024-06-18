const express = require('express');
const { Ticket } = require('../models/ticket');
const { Passenger } = require('../models/passenger');

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { departureTime, arrivalTime, passenger } = req.body;

        // Vérification si le créneau horaire est disponible
        const existingReservation = await Ticket.findOne({
            isBooked: true,
            departureTime,
            arrivalTime
        });

        if (existingReservation) {
            return res.status(400).send("Ce créneau horaire n'est pas disponible. Veuillez choisir un autre horaire.");
        }

        // Vérification des créneaux horaires disponibles
        const isSlotAvailable = await Ticket.find({
            $or: [
                { $and: [{ departureTime: { $lt: departureTime } }, { arrivalTime: { $gt: departureTime } }] },
                { $and: [{ departureTime: { $lt: arrivalTime } }, { arrivalTime: { $gt: arrivalTime } }] },
                { $and: [{ departureTime: { $gte: departureTime } }, { arrivalTime: { $lte: arrivalTime } }] }
            ]
        }).countDocuments();

        if (isSlotAvailable > 0) {
            return res.status(400).send("Le créneau horaire spécifié n'est pas disponible.");
        }

        // Enregistrement du passager dans la base de données
        const newPassenger = new Passenger(passenger);
        const savedPassenger = await newPassenger.save();

        if (!savedPassenger) {
            return res.status(400).send("Impossible de sauvegarder les détails du passager.");
        }

        // Création du ticket correspondant au passager
        const newTicket = new Ticket({
            passengerObj: savedPassenger._id,
            departureTime,
            arrivalTime,
            isBooked: true,
            reservedSeats: 0 // Initialisation de reservedSeats à zéro
        });
        const savedTicket = await newTicket.save();

        if (!savedTicket) {
            return res.status(400).send("Impossible de créer un nouveau ticket.");
        }

        // Réponse avec les données du ticket créé
        res.status(200).json(savedTicket);
    } catch (err) {
        console.error("ERROR:: ", err);
        res.status(500).send("Erreur interne du serveur.");
    }
});

router.get('/viewOpen', async (req, res) => {
    try {
        const data = await Ticket.find({
            isBooked: false
        });
        return res.status(200).send(data);
    } catch (err) {
        console.log("ERROR:: ", err);
        return res.status(403).send("Unknown Error!");
    }
});

router.get('/viewClosed', async (req, res) => {
    try {
        const data = await Ticket.find({
            isBooked: true
        });
        return res.status(200).send(data);
    } catch (err) {
        console.log("ERROR:: ", err);
        return res.status(403).send("Unknown Error!");
    }
});

router.get('/:ticketId', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticketData = await Ticket.findById(ticketId);
        if (ticketData) {
            return res.status(200).json({
                isBooked: ticketData.isBooked
            });
        } else {
            return res.status(404).json({
                "message": "Ticket ID is incorrect!"
            });
        }
    } catch (err) {
        console.log("ERROR:: ", err);
        return res.status(403).send("Unknown Error!");
    }
});

router.put('/:ticketId', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticketData = await Ticket.findByIdAndUpdate(ticketId, {
            $set: { isBooked: req.body.isBooked }
        }, { new: true });

        if (!ticketData) {
            return res.status(404).json({
                "message": "Ticket ID is incorrect!"
            });
        }

        const passengerId = ticketData.passengerObj;
        await Passenger.findByIdAndUpdate(passengerId, {
            $set: req.body.passenger
        }, { new: true });

        res.json({
            "message": "Successfully Updated Details!"
        });
    } catch (err) {
        console.log("ERROR:: ", err);
        return res.status(403).send("Unknown Error!");
    }
});

module.exports = router;
