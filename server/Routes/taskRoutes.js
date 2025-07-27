import express from 'express';
import {
  createTask,
  getActiveTasksByProject,
  getCompletedTasksByProject,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router({ mergeParams: true });



router.use(isAuthenticated)

router.post('/', authorizeRoles('admin', 'employee'), createTask);
router.get('/active', authorizeRoles('admin', 'employee'), getActiveTasksByProject);
router.get('/completed', authorizeRoles('admin', 'employee'), getCompletedTasksByProject);
router.put('/:id',authorizeRoles('admin', 'employee'), updateTask);
router.delete('/:id', authorizeRoles('admin', 'employee'), deleteTask)

export default router;
