//formatoDinero y formatoFecha
const MONTHS_NAMES = [ "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

function formatProcedureStages(procedureStages = {}) {
    if(typeof procedureStages !== "object") return procedureStages

    const newProcedureStages = {}
    for(const stageName in procedureStages) {
        const procedureStage = procedureStages[stageName]

        if(typeof procedureStage !== "object" || Array.isArray(procedureStage)) {
            newProcedureStages[stageName] = procedureStage
        } else {
            newProcedureStages[stageName] = {}

            for(const inputName in procedureStage) {
                const inputValue = procedureStage[inputName]

                if(inputName.toLowerCase().includes("formatofecha")) {
                    newProcedureStages[stageName][inputName] = formatDate(inputValue)
                } else if(inputName.toLowerCase().includes("formatodinero")) {
                    newProcedureStages[stageName][inputName] = formatCurrency(inputValue)
                } else {
                    newProcedureStages[stageName][inputName] = inputValue
                }
            }
        }
    }

    return newProcedureStages
}

function formatDate(date = "") {
    if(typeof date !== "string") return date

    const dateFormat = /^\d{4}-\d{2}-\d{2}$/
    if(!dateFormat.test(date)) return date

    const year = date.split("-")[0],
          month = MONTHS_NAMES[Number(date.split("-")[1]) - 1],
          day = Number(date.split("-")[2])

    return `${day} ${month ? ("de " + month) : ("del mes " + Number(date.split("-")[1]))} de ${year}`
}

function formatCurrency(currency = "") {
    const quantity = Number(currency)

    if(isNaN(quantity)) return ""

    return formatter.format(quantity)
}

module.exports = {
    formatProcedureStages
}