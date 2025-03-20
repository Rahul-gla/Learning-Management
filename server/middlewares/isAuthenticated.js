import jwt from "jsonwebtoken";

const isAuthanticated=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"user Not authanticated",
                success:false
            })
        }

        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return  res.status(401).json({
                message:"invalid token",
                success:false
            })
        }

        req.id=decode.userId;
        next();

    }

    catch (error) {
        console.log(error);
    
        
      }
}

export default isAuthanticated;