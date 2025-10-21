import { connectDB } from './db';
import Hotel from '../hotel/entity';
import User from '../user/entity';
import { Types } from 'mongoose';
import { IHotel } from '../hotel/interface';

export async function setupDefaultHotel() {
  try {
    await connectDB();
    
    // Check if default hotel already exists
    const existingHotel = await Hotel.findOne({ hotelName: 'Default Hotel' });
    if (existingHotel) {
      console.log('Default hotel already exists:', existingHotel._id);
      return (existingHotel._id as Types.ObjectId).toString();
    }
    
    // Create default hotel
    const defaultHotel = new Hotel({
      hotelName: 'Default Hotel',
      phone: '+1234567890',
      address: '123 Main Street',
      city: 'Default City',
      state: 'Default State',
      country: 'United States',
      postalCode: '12345',
      ownerId: new Types.ObjectId(), // Temporary owner ID
      agreeToTerms: true,
      isActive: true,
      emailVerified: true
    });
    
    const savedHotel = await defaultHotel.save();
    console.log('Default hotel created:', savedHotel._id);
    
    return (savedHotel._id as Types.ObjectId).toString();
  } catch (error) {
    console.error('Error setting up default hotel:', error);
    throw error;
  }
}

export async function assignUsersToDefaultHotel() {
  try {
    await connectDB();
    
    // Get the default hotel
    const defaultHotel = await Hotel.findOne({ hotelName: 'Default Hotel' });
    if (!defaultHotel) {
      throw new Error('Default hotel not found');
    }
    
    // Update all users to have the default hotel ID
    const result = await User.updateMany(
      { hotelId: { $exists: false } }, // Only update users without hotelId
      { $set: { hotelId: defaultHotel._id } }
    );
    
    console.log(`Updated ${result.modifiedCount} users with default hotel ID`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Error assigning users to default hotel:', error);
    throw error;
  }
}
