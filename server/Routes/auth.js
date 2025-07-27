import express from 'express';
import { authenticateUser, getusernameFromId } from '../controllers/authenticate.js';

const router = express.Router();
router.post('/', authenticateUser);
router.get('/:userId', getusernameFromId); // Assuming you have a function to get username from userId

export default router;