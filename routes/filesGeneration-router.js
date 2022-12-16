const { Router } = require("express")
const { 
    generatePDF 
} = require("../controllers/filesGeneration-controller")

const router = Router()

router.get("/generatePDF", generatePDF)

module.exports = router