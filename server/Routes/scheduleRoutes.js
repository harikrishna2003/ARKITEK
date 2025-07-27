import express from "express";
import { createMeeting, getMeetingsByProject, updateMeeting, deleteMeeting } from "../controllers/scheduleController.js";
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated)

router.post('/', authorizeRoles('admin'), createMeeting);           // POST /projects/:projectId/meetings
router.get('/',authorizeRoles('admin', 'employee'), getMeetingsByProject);
router.put('/:id',authorizeRoles('admin'), updateMeeting)     
router.delete('/:id',authorizeRoles('admin'), deleteMeeting)     

export default router;
