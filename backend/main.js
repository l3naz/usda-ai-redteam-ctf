// main.js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const challenges = require('./challenges.json');

import dotenv from 'dotenv';
import express from 'express'
import error from './Middlewares/error.js';
import notFound from './Middlewares/notFound.js';
import router from './Routes/mainRoutes.js'

const app = express();
app.use(express.json());
dotenv.config();

//app.get('/', (_req, res) => res.send('API OK'));

app.use('/',router)

app.use(error)

app.use(notFound)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
