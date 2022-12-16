const { Router } = require('express');

const userRouter = require('./user-router');
const propertyRouter = require('./property-router');
const procedureRouter = require('./procedure-router');
const vehicleRouter = require('./vehicles-router');
const contactsRouter = require('./contacts-router');
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
const requestRouter = require('./requests-router');
const mailRouter = require('./mail');
const databasesRouter = require('./databases-router');
//company
const companyRouter = require('./company/company-router');
const companyOrdersRouter = require('./company/companyOrders-router');
const companySalesRouter = require('./company/companySales-router');
const companyQuotationsRouter = require('./company/companyQuotation-router');
const companyAccountsRouter = require('./company/companyAccounts-router');
const companyProductsRouter = require('./company/companyProducts-router');
const companyPurchaseRouter = require('./company/companyPurchaseOrders-router');
const companyOpportunitiesRouter = require('./company/companyOpportunities-router');
const companyReportsRouter = require("./company/companyReports-router");
//documentGenerator
const filesGenerationRouter = require("./filesGeneration-router");
//PublicApi
const keyRouter = require("./PublicApi/apiKey-router");
const accountsRouterPublic = require("./PublicApi/accounts-router-api")

const appRouter = (app) => {
  const routerV1 = Router();
  app.use('/api/v1', routerV1);
  routerV1.use('/users', userRouter);
  routerV1.use('/procedure', procedureRouter);
  routerV1.use('/property', propertyRouter);
  routerV1.use('/vehicle', vehicleRouter);
  routerV1.use('/contacts', contactsRouter);
  routerV1.use('/forms', formRouter);
  routerV1.use('/mailingList', mailingList);
  routerV1.use('/supportTicket', supportTicket);
  routerV1.use('/faq', faqRouter);
  routerV1.use('/product', productRouter);
  routerV1.use('/result', ResultRouter);
  routerV1.use('/formCategories', formCategoryRouter);
  routerV1.use('/auth', authRouter);
  routerV1.use('/invoices', invoiceRouter);
  routerV1.use('/generate', generateFileRouter);
  routerV1.use('/article', articleRouter);
  routerV1.use('/document', documentsRouter);
  routerV1.use('/request', requestRouter);
  routerV1.use('/mail', mailRouter);
  routerV1.use('/database', databasesRouter);
  //company
  routerV1.use('/company', companyRouter);
  routerV1.use('/companyOrders', companyOrdersRouter);
  routerV1.use('/companySales', companySalesRouter);
  routerV1.use('/companyQuotations', companyQuotationsRouter);
  routerV1.use('/companyAccounts', companyAccountsRouter);
  routerV1.use('/companyProducts', companyProductsRouter);
  routerV1.use('/companyPurchase', companyPurchaseRouter);
  routerV1.use('/companyOpportunities', companyOpportunitiesRouter);
  routerV1.use('/companyReports', companyReportsRouter);
  //documentGenerator
  routerV1.use('/filesGeneration', filesGenerationRouter);
  //V2
  //PublicApi
  const routerPublicV1 = Router();
  app.use('/api/public/v1', routerPublicV1);
  routerV1.use('/key', keyRouter);
  routerPublicV1.use('/accounts', accountsRouterPublic);
  //PublicApi V2
};

module.exports = appRouter;
