import { initializeDatabase } from '../services/database';

// Initialize the database when the app starts
const initDB = async () => {
  try {
    await initializeDatabase();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
};

// Export for use in app initialization
export { initDB };
