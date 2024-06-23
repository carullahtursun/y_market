const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    image: {
      type: String,
      required: true,
    },
    pdf: {
      type: String,

    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
      type: Number,
      required: true
    },
    likes: {
      type: Array,
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: true
    }

  }, {
  timestamps: true
}
);

module.exports = mongoose.model('Product', productSchema);