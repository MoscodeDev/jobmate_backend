import express from 'express';
import { createUser, editUser, getUser, loginUser, logoutUser } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/user', isAuthenticated, getUser);
router.put('/edit',isAuthenticated, editUser);


export default router;