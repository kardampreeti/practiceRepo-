const jwt = require('jsonwebtoken');
const logger = require('../logger/log');
const UserRole = require('../enums/role');
require('dotenv').config();

function authenticateToken(req,res,next) {
    logger.info('Activating AuthenticateToken Middleware');
    try{
      const bearerHeader = req.headers['authorization'];
      console.log("bearerHeader : ",bearerHeader);
      const token = bearerHeader.split(' ')[1];
      console.log("token : ",token);

      if (!token) {
        logger.error(' Token Missing : Token not provided');
        return res.status(401).send('Token Missing for Authorization!');
      }

      jwt.verify(token,process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
          logger.error(/*'Invalid Token or Token Expired'*/err);
          return res.status(403).send('Invalid Token or Token Expired');
        }
  
      const userRole = decoded.user.role;
      logger.info(`Token Verified for User: ${userRole}`);

      //role verification ( authorization )
      if (userRole != UserRole.ADMIN) {
          logger.error(`Unauthorized with Role : ${userRole}`);
          return res.status(401).send(`Unauthorized with Role : ${userRole}`);
      }

      // assign userDetail to req for further process 
      req.user = decoded.user;
      next();
      });

    }catch(err){
      logger.error(`Error : ${err}`);
      res.status(500).send('Internal Server Error');
    }  
  
}

module.exports = authenticateToken;
