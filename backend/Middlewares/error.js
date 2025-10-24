const error = (err,req,res,next)=>{
        
        if(err.status){
            return res.status(err.status).json({msg:err.message})
        }
    
        console.log(err)
        return res.status(500).json({msg:'Server Crashed !!!!!!'})
    
}

export default error