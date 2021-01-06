import { Document, ObjectId } from 'mongoose';

export interface Admin extends Document {
    readonly name: string;
    readonly password: string;
    readonly email: string;
    readonly status: string;
    readonly createDate: Date;
    readonly updateDate: Date;
    readonly authToken: string;
}
