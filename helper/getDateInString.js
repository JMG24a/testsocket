const getDateInString = (data) => {
  // var d = new Date("2015-12-04T00:00:00");
  const date = new Date(data)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${formatToTwoDigitsString(month)}-${formatToTwoDigitsString(day)}`
}

const formatToTwoDigitsString = (number = 0) => number < 10 && number >= 0 ? `0${number}` : number.toString()

module.exports = {
  getDateInString
}
