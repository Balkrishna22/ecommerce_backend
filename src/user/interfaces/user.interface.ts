import { Document, ObjectId } from 'mongoose';

export interface User extends Document {
    readonly name: string;
    readonly password: string;
    readonly email: string;
    readonly status: string;
    readonly createDate: Date;
    readonly updateDate: Date;
}
