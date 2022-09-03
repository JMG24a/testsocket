const PDF  = require('html-pdf');
const {switches} = require('../template')

const generatorPDF = (procedureInfo) => {

  const html = switches(procedureInfo)

  const options = {
    format: 'Letter',
    orientation: 'portrait'
  };

  const date = new Date()

  const namePDF = `${date.getMilliseconds()}_${date.getDay()}-${procedureInfo.id}`

  PDF.create(html, options).toFile(`./public/pdf/${namePDF}.pdf`, function(err, res){
    if(err){
      console.log(err);
    }
  })

  return namePDF
}

module.exports = {
  generatorPDF
}
