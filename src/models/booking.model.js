const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'clientName es obligatorio'],
      trim: true
    },
    clientEmail: {
      type: String,
      required: [true, 'clientEmail es obligatorio'],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'clientEmail debe ser un email válido']
    },
    date: {
      type: String,
      required: [true, 'date es obligatoria'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD']
    },
    time: {
      type: String,
      required: [true, 'time es obligatoria'],
      match: [/^\d{2}:\d{2}$/, 'time debe tener formato HH:MM']
    },
    status: {
      type: String,
      default: 'pending',
      trim: true,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed'],
        message: 'status debe ser pending, confirmed, cancelled o completed'
      }
    },
    services: {
      type: [
        {
          service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
            min: [1, 'quantity debe ser al menos 1']
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
