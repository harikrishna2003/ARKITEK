import express from 'express';
import { createLeaveHistory, getAllLeaveHistory } from '../controllers/leaveHistoryController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';


const router = express.Router();

router.use(isAuthenticated)

router.post('/',authorizeRoles('admin'), createLeaveHistory);
router.get('/',authorizeRoles('admin'), getAllLeaveHistory);


export default router;