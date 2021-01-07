import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    discription: String,
    image: String,
    category: String,
    createDate: Date,
    updateDate: Date,
    authToken: String,
    status: Boolean
});
