import express from 'express'
import {main,postapi} from '../Controllers/main.js'
const router = express.Router()


router.get('/',main)

router.post('/api',postapi)

export default router