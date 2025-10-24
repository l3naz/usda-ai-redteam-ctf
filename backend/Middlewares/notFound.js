const notFound = (req,res,next)=>{
    //err.status = 404
    const err = new Error(`Not Found: ${req.originalUrl}`);
    err.status = 404;              // property, not a function
    err.code = 'NOT_FOUND';
    next(err);
}

export default notFound