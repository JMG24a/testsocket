const fs = require("fs")
const path = require("path")

const documentWithHtmlAndCss = (FILE_NAME) => {
    let preHtml = fs.readFileSync(path.join(__dirname, `./html/${FILE_NAME}/${FILE_NAME}.html`), "utf8")
    const stylesheets = preHtml.match(/stylesheet/g).length;
    for (let i = 0; i < stylesheets; i++) {
        const indexStart = preHtml.indexOf('stylesheet" href="')
        const indexEnd = preHtml.indexOf('accesskey')
        const link = preHtml.substring((indexStart - 11), (indexEnd + 17))
        const indexStartCss = link.indexOf('/')
        const indexEndCss = link.indexOf("|")
        const nameCss = link.substring((indexStartCss + 1), indexEndCss)
        console.log(path.join(__dirname, `./html/${nameCss}/${nameCss}`))
        const preCss = fs.readFileSync(path.join(__dirname, `./html/${nameCss.replace(".css", "")}/${nameCss}`), "utf8")
        const resultCss = `<style>${preCss}</style>`
        preHtml = preHtml.replace(`${link}`, `${resultCss}`)
    }
    return preHtml
}

module.exports = {
    documentWithHtmlAndCss
}