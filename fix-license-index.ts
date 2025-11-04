// Script to fix the licenceKey index in MongoDB
// Run this once: npx tsx fix-license-index.ts
// Or: npx ts-node --esm fix-license-index.ts

import mongoose from 'mongoose';

async function fixLicenseIndex(): Promise<void> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('Please set MONGODB_URI environment variable');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    const collection = db.collection('licences');

    // Drop the existing index if it exists
    try {
      await collection.dropIndex('licenceKey_1');
      console.log('✅ Dropped existing licenceKey_1 index');
    } catch (error: any) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index licenceKey_1 does not exist, skipping drop');
      } else {
        throw error;
      }
    }

    // Create sparse unique index
    await collection.createIndex(
      { licenceKey: 1 },
      { unique: true, sparse: true, name: 'licenceKey_1' }
    );
    console.log('✅ Created sparse unique index on licenceKey');

    // Verify the index
    const indexes = await collection.indexes();
    const licenceKeyIndex = indexes.find(idx => idx.name === 'licenceKey_1');
    
    if (licenceKeyIndex) {
      console.log('✅ Index verified:', JSON.stringify(licenceKeyIndex, null, 2));
      
      // Check if sparse is set correctly
      if (licenceKeyIndex.sparse) {
        console.log('✅ Sparse index is correctly configured');
      } else {
        console.warn('⚠️  Warning: Index may not be sparse');
      }
    } else {
      console.error('❌ Index not found after creation');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixLicenseIndex();

