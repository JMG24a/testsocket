const { Router } = require("express")
const { 
    generateFile 
} = require("../controllers/generate-file-controller")

const router = Router()

router.post("/:fileType/:nameFile", generateFile)

module.exports = router