const { Router } = require('express');

const userRouter = require('./user-router');
const propertyRouter = require('./property-router');
const procedureRouter = require('./procedure-router');
const vehicleRouter = require('./vehicles-router');
const relationRouter = require('./relation-router');
const formRouter = require('./form-router');
const mailingList = require('./mailingList');
const supportTicket = require('./support-ticket');
const faqRouter = require('./faq');
const productRouter = require('./product');
const ResultRouter = require('./result-router');
const formCategoryRouter = require('./form-category');
const authRouter = require('./auth');
const invoiceRouter = require('./invoice-router');
const generateFileRouter = require('./generate-file');
const articleRouter = require('./article-router')
const documentsRouter = require('./documents')

const appRouter = (app) => {
  const routerV1 = Router();
  app.use('/api/v1', routerV1);
  routerV1.use('/users', userRouter);
  routerV1.use('/procedure', procedureRouter);
  routerV1.use('/property', propertyRouter);
  routerV1.use('/vehicle', vehicleRouter);
  routerV1.use('/relation', relationRouter);
  routerV1.use('/forms', formRouter);
  routerV1.use('/mailingList', mailingList);
  routerV1.use('/supportTicket', supportTicket);
  routerV1.use('/faq', faqRouter);
  routerV1.use('/product', productRouter);
  routerV1.use('/result', ResultRouter);
  routerV1.use('/formcategories', formCategoryRouter);
  routerV1.use('/auth', authRouter);
  routerV1.use('/invoices', invoiceRouter);
  routerV1.use('/generate', generateFileRouter);
  routerV1.use('/article', articleRouter);
  routerV1.use('/document', documentsRouter);
  //V2
};

module.exports = appRouter;
