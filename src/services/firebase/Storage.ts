import { getStorage } from 'firebase/storage';
import { app } from './config';

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
