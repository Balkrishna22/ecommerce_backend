import { Document, ObjectId } from 'mongoose';

export interface Product extends Document {
    readonly productName: string;
    readonly image: string;
    readonly price: number;
    readonly discription: string;
    readonly category: string;
    readonly createDate: Date;
    readonly updateDate: Date;
}
