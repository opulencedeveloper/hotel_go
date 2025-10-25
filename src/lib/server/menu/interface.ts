import { Document, Types } from "mongoose";
import { MenuStatus } from "./enum";

export interface IMenu extends Document {
  _id: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomTypeId: string;
  itemName: string;         
  category: string;        
  price: number;            
  prepTime: number;          
  status: MenuStatus; 
  ingredients: string;    
}


export interface ICreateMenuUserInput {
  itemName: string;         
  category: string;        
  price: number;            
  prepTime: number;          
  status: MenuStatus; 
  ingredients: string;    
}

export interface ICreateMenuInput {
  hotelId: Types.ObjectId;
  itemName: string;         
  category: string;        
  price: number;            
  prepTime: number;          
  status: MenuStatus; 
  ingredients: string;    
}

export interface IEditMenuUserInput {
  menuId: Types.ObjectId;
  itemName: string;         
  category: string;        
  price: number;            
  prepTime: number;          
  status: MenuStatus; 
  ingredients: string;    
}
