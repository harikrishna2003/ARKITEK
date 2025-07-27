import express from 'express';
import { createLeave, getAllLeaves, deleteLeave, updateLeave, getLeavesByEmployeeId } from '../controllers/leaveController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(isAuthenticated)

router.post('/', authorizeRoles('admin'), createLeave);
router.get('/', authorizeRoles('admin'), getAllLeaves);
router.delete('/:id', authorizeRoles('admin') ,deleteLeave);
router.put('/:id', authorizeRoles('admin') ,updateLeave);
router.get('/:employeeId', authorizeRoles('admin', 'employee') ,getLeavesByEmployeeId)


export default router;