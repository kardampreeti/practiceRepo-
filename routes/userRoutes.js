// file to handle all the requests of User 

const express = require ('express');
const router = express.Router();
const User = require('../Models/user');
const logger = require('../logger/log');
const controllerName = "UserRoutes";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/UserAuth');
const UserStatus = require('../enums/status');
const UserRole = require('../enums/role');
require('dotenv').config();

// create a new user
router.post('/create', async (req, res) => 
{
    const fnIdentifier = `[${controllerName}] : create-newUser : `;
    logger.info(`${fnIdentifier} :\n Incoming User Details :${JSON.stringify(req.body)} `);
    try 
    { 
        const incomingUser = new User(req.body);
        const createdUser = await incomingUser.save();
        logger.info(`${fnIdentifier} : New User Created SuccessFully ...\nNew-User : ${createdUser} `);
        res.status(201).send(createdUser);
    } 
    catch (err) 
    {
        logger.error(`${fnIdentifier} : Error : ${err}`);
        if(err.code === 11000 && err.keyPattern.email)
            {
                return res.status(409).send({ message: 'Email already exists' }); 
            }
        else if (err.name === 'ValidationError') 
            {
                return res.status(400).send({ message: err.message });
            }
        else
            {
                return res.status(500).send({message: 'Internal Server Error'});
            }
    }
    finally 
    {
        logger.info(`${fnIdentifier} : End`);
    }
});

// login user by assigning token 
router.post('/login', async (req, res) => {
    const fnIdentifier = `[${controllerName}] : Login-user`;
  
    try {
      logger.info(`${fnIdentifier} : Incoming User Login Details : ${JSON.stringify(req.body)}`);
      
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        logger.info(`${fnIdentifier} : User not found with email ${email}`);
        return res.status(404).send('User not found');
      }
  
      logger.info(`${fnIdentifier} : User found: ${JSON.stringify(user)}`);
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.info(`${fnIdentifier} : Invalid password for user with email ${email}`);
        return res.status(401).send('Invalid password');
      }
      logger.info(`${fnIdentifier} : Password verified for user with email ${email}`);
  
      const token = jwt.sign({ user }, process.env.TOKEN_KEY, { expiresIn: 2*60 });
      logger.info(`${fnIdentifier} : Token generated successfully`);
      res.json({ token });

    } catch (error) {
      logger.error(`${fnIdentifier} : Error: ${error}`);
      res.status(500).send('Error in Authenticating User. Please try again later.');
    } finally {
      logger.info(`${fnIdentifier} : End`);
    }
  });
  
// profile to check role-based-access-control
router.get('/profile', authenticateToken, (req, res) => {
    logger.info('Authorized to Access this Route ! :)')
    res.send('Authorized to Access this Route ! :)');
  });

//getting all active users 
router.get('/all',async (req,res)=>
{
    const fnIdentifier = `[${controllerName}] : All-Users : `;
    try{
        const users = await User.find({status: UserStatus.ACTIVE});
        logger.info(`${fnIdentifier} : \n ${users}`);
        res.status(200).send(users);
    }
    catch(err)
    {
        logger.error(`${fnIdentifier} : Error : ${err}`);
        res.status(500).send({message : 'Internal Server Error.'});
    }
    finally
    {
        logger.info(`${fnIdentifier} : End`);
    }
    
});

router.get('/:id',async (req,res)=>
{
    const fnIdentifier = `[${controllerName}] : Find-User : `;
    logger.info(`${fnIdentifier} :\n Incoming User Detail :${JSON.stringify(req.params)} `);
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);  // or await User.findOne({id:id})
        logger.info(`${fnIdentifier} : \n ${user}`);
        res.status(200).send(user);
    }
    catch(err)
    {
        logger.error(`${fnIdentifier} : Error : ${err}`);
        res.status(500).send({message : 'Internal Server Error.'});
    }
    finally
    {
        logger.info(`${fnIdentifier} : End`);
    }

});

router.patch('/update/:id',async(req,res)=>{    //used for partial updation 
    const fnIdentifier = `[${controllerName}] : Update-User : `;
    logger.info(`${fnIdentifier} :\n Incoming User-Id : ${JSON.stringify(req.params)}\n Field to Update :
        ${JSON.stringify(req.body)}
    )} `);
    const userId = req.params.id;
    const updateField = req.body;
    try{
            const updatedUser = await User.findOneAndUpdate(
                {_id:userId},
                {$set:updateField},
                {new: true}
             );
            logger.info(`updated User = ${JSON.stringify(updatedUser)}`);
            res.status(200).send(updatedUser);
    }
    catch(err)
    {
        logger.error(`${fnIdentifier} : Error : ${err}`);
        if (err.path) {
            return res.status(404).send({ message: `User not found with ${userId}` });
        }
        res.status(500).send({message : 'Internal Server Error.'});
    }
    finally{
        logger.info(`${fnIdentifier} : End`);
    }

});

router.delete('/delete/:id',async(req,res)=>{
    const fnIdentifier = `[${controllerName}] : Delete-User : `;
    logger.info(`${fnIdentifier} :\n Incoming User Details :${JSON.stringify(req.params)} `);
    const userId =req.params.id;
    try{
        
    }
    catch(err)
    {
        logger.error(`${fnIdentifier} : Error : ${err}`);
        res.status(500).send({message : 'Internal Server Error.'});
    }
    finally 
    {
        logger.info(`${fnIdentifier} : End`);
    }
})

// router.get('/all',async (req,res)=>
//     {
//         const fnIdentifier = `[${controllerName}] : All-Users : `;
//         try{
//             const users = await User.find();
//             logger.info(`${fnIdentifier} : \n ${users}`);
//             res.status(200).send(users);
//         }
//         catch(err)
//         {
//             logger.error(`${fnIdentifier} : Error : ${err}`);
//             res.status(500).send({message : 'Internal Server Error.'});
//         }
//         finally
//         {
//             logger.info(`${fnIdentifier} : End`);
//         }
        
//     });
    



module.exports = router;