import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            // Generar código único, por ejemplo, usando un paquete como shortid
            const shortid = require('shortid');
            return shortid.generate();
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
},
{
    strict: false
});

const TicketModel = mongoose.model('tickets', ticketSchema);

export { TicketModel };
