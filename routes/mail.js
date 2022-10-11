const { Router } = require('express');
const router = Router();
const { contactForm } = require('../mails/contactForm');

const postMailContact = async (req, res) => {
  const {email, content} = req.body;
  try {
    if(!email || !content){
      res.status(201).json({
        ok: false,
        msg: 'Error de formato',
      });
    }

    await contactForm(email, content)

    res.status(201).json({
      ok: true,
      msg: 'Agregado correctamente'
    });
  } catch {
    console.log('error');
  }
};

router.post('/contact', postMailContact);

module.exports = router;
