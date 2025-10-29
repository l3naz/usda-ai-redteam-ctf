import express from 'express'
import {main,postapi,metadata} from '../Controllers/main.js'
const router = express.Router()


router.get('/',main)

router.post('/metadata',metadata)

router.post('/api',postapi)

export default router