const { Router } = require('express');
const authController = require('../controllers/auth.js');

const router = Router();

router.post('/recovery',
  async(req,res,next)=>{
    try{
      const body = req.body;
      const success = await authController.recovery(body)
      res.json(success)
    }catch(err){
      next(err)
    }
})

router.post('/recovery/password',
  async(req,res,next)=>{
    try{
      const {token, password} = req.body;
      const success = await authController.changePassword(token,password)
      res.json(success)
    }catch(err){
      next(err)
    }
})
