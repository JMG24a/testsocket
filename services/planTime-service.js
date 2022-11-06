const generateExpirationTime = () => {
  const yearInMilliseconds = 31536000000;
  const today = new date()
  const expiredDate = today.getTime() + yearInMilliseconds;
  const inOneYear = new Date(expiredDate)
  return inOneYear
}

const expiredDateVerification = (expiredDay) => {
  const expired = new date(expiredDay);
  const today = new date();
  if(expired < today){
    return true
  }else{
    return false
  }
}

const addTimeAdditional = (expiredDay, ) => {
  const monthInMilliseconds = 2628000000;
  const expired = new date(expiredDay);
  const addition = expired.getTime() + monthInMilliseconds;
  const inOneMonth = new Date(addition)
  return inOneMonth
}

const RemovingRemainingTime = (expiredDay, ) => {
  const today = new Date();
  const expired = new date(expiredDay);
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
