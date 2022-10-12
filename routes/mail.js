const { Router } = require('express');
const router = Router();
const { contactForm } = require('../mails/contactForm');
const uploadFiles = require('../middleware/multer');

const postMailContact = async (req, res) => {
  const {email, content, subject, name} = req.body;
  const nameAndContent = `-${name}- ${email} : ${content}`;
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
  const { name, email, position } = req.body;
  const { file } = req;

  try {
    if(!email || !name || !position){
      res.status(201).json({
        ok: false,
        msg: 'Error de formato',
      });
    }

    const filename = file.filename
    const subject = `Solicitud de empleo para ${name}`
    const nameAndContent = `Solicitud de empleo para ${name}.
    Se puede contactar con ${name} por medio de su correo electronico ${email}`


    await contactForm(email, nameAndContent, subject, filename)

    res.status(201).json({
      ok: true,
      msg: 'Agregado correctamente'
    });
  } catch {
    console.log('error');
  }
};

router.post('/contact', postMailContact);
router.post('/work-with-us', uploadFiles(), postMailWorkWithUs);

module.exports = router;
