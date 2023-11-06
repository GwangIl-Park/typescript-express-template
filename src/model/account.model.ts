import { IAccount } from '@/interface/account.interface';
import mongoose, { Document } from 'mongoose';

const Account = new mongoose.Schema(
  {
    address: {
      type:String,
      index:true
    }
  }
);

export const AccountModel = mongoose.model<IAccount & Document>('account', Account, 'account');