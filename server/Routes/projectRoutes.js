import express from 'express';
import taskRoutes from './taskRoutes.js';
import noteRoutes from './noteRoutes.js';
import eventRoutes from './eventRoutes.js';
import clientRoutes from './clientRoutes.js';
import agencyRoutes from './agencyRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';
import { createProject, getAllProjects, getAllActiveProjects, getAllCompletedProjects, getAllProjectParticipants, addParticipantsByIdList, getUserAssignedProjects, getUserCompletedProjects, closeProject } from '../controllers/projectController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(isAuthenticated)

router.use('/:projectId/tasks', taskRoutes); // This will handle all task-related routes for a specific project
router.use('/:projectId/notes', noteRoutes); // This will handle all note-related routes for a specific project
router.use('/:projectId/events', eventRoutes); // This will handle all event-related routes for a specific project
router.use('/:projectId/details/clients', clientRoutes); // This will handle all agency-related routes for a specific project
router.use('/:projectId/details/agencies', agencyRoutes);
router.use('/:projectId/schedule', scheduleRoutes); // This will handle all schedule-related routes for a specific project


 
router.post('/', authorizeRoles('admin'),createProject);
router.get('/', authorizeRoles('admin'),getAllProjects);
router.get('/active', authorizeRoles('admin'), getAllActiveProjects);
router.get('/completed', authorizeRoles('admin'), getAllCompletedProjects);
router.get('/:projectId/participants', authorizeRoles('admin', 'employee'), getAllProjectParticipants);
router.put('/:projectId/participants', authorizeRoles('admin'), addParticipantsByIdList);
router.get('/:employeeId/assigned',authorizeRoles('admin','employee'), getUserAssignedProjects)
router.get('/:employeeId/completed', authorizeRoles('admin','employee'), getUserCompletedProjects)
router.patch('/:projectId/close', authorizeRoles('admin'), closeProject); // This will handle closing a project



export default router;  
