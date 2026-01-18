import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-fix invalid unique indexes on array subdocument fields.
    // Older versions of the Reward schema used `unique: true` inside arrays which can create
    // indexes that treat missing values as `null`, causing E11000 duplicate key errors.
    try {
      const db = conn.connection.db;
      if (!db) {
        return;
      }

      const rewardsCollection = db.collection('rewards');
      const indexNames = (await rewardsCollection.indexes()).map((i) => i.name);

      const maybeBadIndexes = [
        'blockchainCredits.transactionId_1',
        'coupons.code_1',
      ];

      for (const indexName of maybeBadIndexes) {
        if (indexNames.includes(indexName)) {
          await rewardsCollection.dropIndex(indexName);
          console.log(`🧹 Dropped legacy index: rewards.${indexName}`);
        }
      }
    } catch (indexError) {
      // Non-fatal: app can still run if the DB user lacks dropIndex permissions.
      console.warn('⚠️  Rewards index cleanup skipped:', indexError);
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;
