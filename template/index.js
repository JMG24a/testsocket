const FS = require('fs');
const Path = require('path');

function switches(procedureInfo){
  const title = procedureInfo.title.toLowerCase().replace(' ', '-');
  const id = procedureInfo.idForm

  const selectTemplate = `${title.replace(' ', '-')}-${id}`;

  const root = `${process.cwd()}/template`;
  const direction = Path.join(root,  `/${selectTemplate}.html`);

  let html = FS.readFileSync(direction, 'utf-8')

  const values = {}

  const stages = procedureInfo.stages[0].map(item => item)

  stages.map((item,key0) => Object.keys(item).map(k => k).filter(f => f !== 'step').map((i,key1) => values[stages[key0][key1].name] = stages[key0][key1].value))

  Object.keys(values).map(myKey => {
    html = html.replace(`&{${myKey}}`, `${values[`${myKey}`]}`)
  })

  return html
}

module.exports = {switches}
