import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct location
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectToDatabase = async () => {
  try {
    // Use default MongoDB URI if environment variable is not set
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hollus';
    
    console.log(`Attempting to connect to MongoDB: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    return false;
  }
};

export default connectToDatabase;