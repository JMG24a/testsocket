const { Router } = require('express');
const userRouter = require('./user-router');
const propertyRouter = require('./property-router');
const procedureRouter = require('./procedure-router');
const vehicleRouter = require('./vehicles-router');
const relationRouter = require('./relation-router');
const formRouter = require('./form-router');
const mailingList = require('./mailingList');
const supportTicket = require('./support-ticket');

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

  //V2
};

module.exports = appRouter;
