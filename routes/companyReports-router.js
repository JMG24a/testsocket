const { Router } = require('express')
const companyReportController = require('../controllers/company/companyReports-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getReports = async(req, res) => {
  const dates = req.query;
  const token = req.myPayload;

  try{
    const {report, counts} = await companyReportController.getReports(dates, token)

    res.status(200).json({
      ok: true,
      msg: "Reporte de ventas",
      report,
      counts
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

router.get("/", validateToken, getReports);

module.exports = router
