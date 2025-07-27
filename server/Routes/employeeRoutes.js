import express from 'express';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeeById } from '../controllers/employeeController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(isAuthenticated)

router.get('/', authorizeRoles('admin'), getAllEmployees);
router.post('/', authorizeRoles('admin'),createEmployee);
router.put('/:id', authorizeRoles('admin'),updateEmployee);
router.delete('/:id', authorizeRoles('admin'),deleteEmployee);
router.get('/:id', authorizeRoles('admin'),getEmployeeById);    

export default router;