import express from 'express';
import {
  createEvent,
  getAllEventsForProject,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated)

router.post('/', authorizeRoles('admin'), createEvent);
router.get('/',  authorizeRoles('admin', 'employee'),getAllEventsForProject);
router.put('/:id', authorizeRoles('admin'), updateEvent);
router.delete('/:id', authorizeRoles('admin'), deleteEvent);

export default router;
