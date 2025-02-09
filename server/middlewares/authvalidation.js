const Joi=require('joi');

const signupValidation=(res,req,next)=>{
    const schema=Joi.object({
        
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required(),
        firstName:Joi.string().required(),
        lastName:Joi.string().required(),
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).json({mesaage:"Bad Request",error})
    }      
    next();
};
const loginupValidation=(res,req,next)=>{
    const schema=Joi.object({
        
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required(),
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).json({mesaage:"Bad Request",error})
    }      
    next();
}
module.exports={
    signupValidation,loginupValidation
}