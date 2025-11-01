import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const challenges = require('./challenges.json');
import { withContext, httpLogger } from './Middlewares/logging.js';
import { corsMiddleware } from './Middlewares/cors.js';
import dotenv from 'dotenv';
import express from 'express'
import {error,notFound} from './Middlewares/error.js';
import router from './Routes/mainRoutes.js'

const app = express();
dotenv.config();

// CORS must be before other middleware
app.use(corsMiddleware);

app.use(express.json());
app.use(withContext)
app.use(httpLogger)

//app.get('/', (_req, res) => res.send('API OK'));

app.use('/',router)

app.use(notFound)

app.use(error)

const PORT = process.env.PORT || 5100;
export const server = app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
  
}); 

