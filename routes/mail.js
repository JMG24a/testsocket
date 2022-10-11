const { Router } = require('express');
const router = Router();
const { contactForm } = require('../mails/contactForm');

const postMailContact = async (req, res) => {
  const {email, content, subject, name} = req.body;
  const nameAndContent = `-${name}-: ${content}`;
  console.log('RESULTS: ', email, content, subject, name)

  try {
    if(!email || !content){
      res.status(201).json({
        ok: false,
        msg: 'Error de formato',
      });
    }

    await contactForm(email, nameAndContent, subject)

    res.status(201).json({
      ok: true,
      msg: 'Agregado correctamente'
    });
  } catch {
    console.log('error');
  }
};

const postMailWorkWithUs = async (req, res) => {
  const {email, content, subject, name} = req.body;
  const nameAndContent = `-${name}-: ${content}`;

  try {
    if(!email || !content){
      res.status(201).json({
        ok: false,
        msg: 'Error de formato',
      });
    }

    await contactForm(email, nameAndContent, subject)

    res.status(201).json({
      ok: true,
      msg: 'Agregado correctamente'
    });
  } catch {
    console.log('error');
  }
};

router.post('/contact', postMailContact);
router.post('/work-with-us', postMailWorkWithUs);

module.exports = router;
