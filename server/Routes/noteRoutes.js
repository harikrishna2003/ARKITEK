import express from 'express';
import { saveNote, getNotes, deleteNote, updateNote } from '../controllers/noteController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router({mergeParams: true});

router.use(isAuthenticated)

router.get('/', authorizeRoles('admin', 'employee'),getNotes);
router.post('/', authorizeRoles('admin'),saveNote);
router.delete('/:id', authorizeRoles('admin'),deleteNote);
router.put('/:id', authorizeRoles('admin', 'employee'),updateNote);


export default router;
