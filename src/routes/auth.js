import express from 'express'
import { body } from 'express-validator'
import { userRegister, userLogin, getMe } from '../controllers/auth.js'
import authenticateToken from '../../authenticate.js'
const authRouter = express.Router();

authRouter.get('/me', authenticateToken, getMe)
authRouter.post('/register', [
    body('name').notEmpty(),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({min: 6})
], userRegister);


authRouter.post('/login', [
    body('email').notEmpty(),
    body('password').notEmpty()
], userLogin)


export default authRouter;