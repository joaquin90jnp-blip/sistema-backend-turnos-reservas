const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name es obligatorio'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'description es obligatoria'],
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'duration es obligatoria'],
      min: [1, 'duration debe ser mayor a 0']
    },
    price: {
      type: Number,
      required: [true, 'price es obligatorio'],
      min: [0, 'price debe ser mayor o igual a 0']
    },
    category: {
      type: String,
      required: [true, 'category es obligatoria'],
      trim: true
    },
    available: {
      type: Boolean,
      required: [true, 'available es obligatorio']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const ServiceModel = mongoose.model('Service', serviceSchema);

module.exports = ServiceModel;
