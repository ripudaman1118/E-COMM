import express from 'express';
import {registerController,loginController,testController} from '../controllers/authController.js'
const router =express.Router();
import { isAdmin, requireSignIn } from '../middlewares/authMiddlewares.js';

router.post('/register',registerController)

router.post('/login',loginController)


router.get('/test',requireSignIn,isAdmin, testController)



export default router;