const { sendMail } = require('../mails/recovery');
const { send_pdf } = require('../mails/send-pdf');
const userController = require('../controllers/user-controller');
const { verifyJWT } = require('../auth/tokens');
const { security, security_confirm } = require('../auth/middleware/security');

const welcome = async (email) => {
  try {
    const content = `<b>Bienvenido a Formuapp</b>`;
    const res = await sendMail(email, content);

    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const recovery = async (body) => {
  try {
    const { email } = body;
    const user = await userController.getUserByEmail(email);

    if (!user) {
      throw new Error('User not fount');
    }

    const jwt = await userController.signToken(user, { expiresIn: '15min' });

    const link = `https://app.formuapp.com/login?recovery=${jwt}`;
    const content = link;

    const idToken = { sub: { id: user.id } };

    await userController.putUser(idToken, { token: jwt });

    const res = await sendMail(user.email, content);

    return res;
  } catch (err) {
    return { error: err };
  }
};

const changePassword = async (token, password) => {
  try {
    const payload = verifyJWT(token);
    const user = await userController.getUserByEmail(payload.sub.email);

    if (token !== user.token) {
      throw new Error('invalid credential');
    }

    const idToken = { sub: { id: user.id } };
    const jwt = await userController.signToken(user, { expiresIn: '2h' });

    const HASH = await security(password);
    const responseUpdate = await userController.putUser(idToken, {
      token: '',
      password: HASH,
    });

    return {
      user: responseUpdate,
      token: jwt,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const changePasswordWhitAuth = async (token, password) => {
  try {
    const user = await userController.getUserByEmail(token.sub.email);
    const isPassword = await security_confirm(password, user.password)
    if (!isPassword) {
      throw new Error('invalid credential');
    }

    const idToken = { sub: { id: user.id } };

    const HASH = await security(password);
    const responseUpdate = await userController.putUser(idToken, {
      token: '',
      password: HASH,
    });

    return {
      user: responseUpdate,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const sendPDF = async (namePDF, email) => {
  try {
    const content = `<b>Formuapp</b>`;
    const res = await send_pdf(namePDF, email, content);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  welcome,
  recovery,
  changePassword,
  changePasswordWhitAuth,
  sendPDF,
};
