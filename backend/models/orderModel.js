import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    orderedProducts: [
        {
            product: {
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                image: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    customer: {
        id: {
            type: Number,
            required:false
        },
        name: {
            type: String,
            required:false
        },
        address: {
            type: String,
            required:false
        },
        phoneNumber: {
            type: Number,
            required:false
        },
    },
    shippingAddress: {
        type: String,
        required: false
    },
    orderStatus: {
        type: String,
        status: ['Active', 'Fulfilled', 'Canceled'],
        default: 'Active'
    },
});

export default mongoose.model("order", orderSchema);