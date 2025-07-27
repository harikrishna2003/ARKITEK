import express from 'express';
import {
  createAgency,
  getAgencies,
  updateAgency,
  deleteAgency
} from '../controllers/agencyController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated)

router.post('/', authorizeRoles('admin'), createAgency);
router.get('/', authorizeRoles('admin', 'employee'),getAgencies);
router.put('/:id', authorizeRoles('admin'),updateAgency);
router.delete('/:id', authorizeRoles('admin'),deleteAgency);

export default router;
