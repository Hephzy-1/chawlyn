import { ErrorResponse } from '../utils/errorResponse';
import User from '../models/user';
import { IUser } from '../models/user';
import { Types } from 'mongoose';
import { generateToken } from '../utils/jwt';
import { hashPassword } from '../utils/hash';

export class UserRepository {
  // create a new user
  static async createUser(values: IUser) {
    try {

      const newToken = await generateToken(values.email);

      const hash = await hashPassword(values.password);
      
      const user = await new User({
        username: values.username,
        email: values.email,
        role: values.role,
        password: hash,
        token: newToken
      }).save();
      return user.toObject();
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }
  

  // get all users
  static async getUsers() {
    try {
      return await User.find().exec()
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get a user by email
  static async getUserByEmail(email:string) {
    try {
      return await User.findOne({ email }).select('+salt +password')
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // get user by id
  static async getUserById(id: string) {
    try {
      return await User.findById(id);
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // update user details
  static async updateUser(id: string, update: Partial<IUser>) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new ErrorResponse("User not found", 404);
      }
      return await User.findByIdAndUpdate(id, update, { new: true }).exec();
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }   

  // delete a user
  static async deleteUser(id: string) {
    try {
      return await User.findOneAndDelete({_id: id})
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }
}