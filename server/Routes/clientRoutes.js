import express from 'express';
import {
  createClient,
  getClientsByProject,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated)

// Create new client for a project
router.post('/', authorizeRoles('admin'), createClient);

// Get all clients for a project
router.get('/', authorizeRoles('admin', 'employee'), getClientsByProject);

// Update a specific clients
router.put('/:id', authorizeRoles('admin'), updateClient);

// Delete a specific clients
router.delete('/:id', authorizeRoles('admin'), deleteClient);

export default router;
