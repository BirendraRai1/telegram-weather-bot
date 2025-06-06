const dotenv = require('dotenv');
dotenv.config();
const authenticate = (req,res,next)=>{
    const passwordFromClient = req.params.password
    const adminPassword = process.env.ADMIN_PASSWORD
    if(passwordFromClient === adminPassword){
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}
module.exports = authenticate