import { logger } from '../lib/logger.js';
import { getCtx } from '../lib/ctx.js';

export const notFound = (req,res,next)=>{
    //err.status = 404
    const err = new Error(`Not Found: ${req.originalUrl}`);
    err.status = 404;              // property, not a function
    err.code = 'NOT_FOUND';
    next(err);
}



export const error = (err,req,res,next)=>{
    
    const requestId = getCtx()?.requestId;
    // Log full error w/ stack once
    logger.error({ err, requestId }, 'Unhandled error');

    if(err.status){
        return res.status(err.status).json({msg:err.message})
    }
    
    console.log(err)
    return res.status(500).json({msg:'Server Crashed !!!!!!'})
    
}

