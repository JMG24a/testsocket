const generateExpirationTime = (extraTime, timeLeft) => {
  const timeInMilliseconds = Number(extraTime);
  const today = timeLeft
  const expiredDate = today + timeInMilliseconds;
  const inLaterTimes = new Date(expiredDate)
  const inLaterTimesString = `${inLaterTimes.getMonth() + 1}/${inLaterTimes.getDate()}/${inLaterTimes.getFullYear()}`
  return inLaterTimesString
}

const expiredDateVerification = (expiredDay) => {
  const expired = new Date(expiredDay);
  const today = new Date();
  if(expired < today){
    return true
  }else{
    return false
  }
}

const addTimeAdditional = (expiredDay) => {
  const monthInMilliseconds = 2628000000;
  const expired = new Date(expiredDay);
  const addition = expired.getTime() + monthInMilliseconds;
  const inOneMonth = new Date(addition)
  return inOneMonth
}

const RemovingRemainingTime = (expiredDay) => {
  const today = new Date();
  const expired = new Date(expiredDay);
  const removing = expired.getTime() - today.getTime();
  const removingTime= new Date(removing)
  return removingTime
}

module.exports = {
  generateExpirationTime,
  expiredDateVerification,
  addTimeAdditional,
  RemovingRemainingTime
};
