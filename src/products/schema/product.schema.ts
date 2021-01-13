import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    discription: String,
    image: Array,
    category: String,
    createDate: Date,
    updateDate: Date,
    authToken: String,
    status: String
});
