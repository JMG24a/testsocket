const { Router } = require("express")
const { 
    generateFile 
} = require("../controllers/generate-file-controller")

const router = Router()

router.get("/:fileType/:nameFile", generateFile)

module.exports = router