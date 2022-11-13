const { ObjectId } = require("mongodb");

//tool edit
function editObject(data, newData){
  const findData = data.filter(item => item._id == newData._id)[0]
  if(findData === undefined){
    return false
  }

  Object.keys(newData).map(item => {
    findData[item] = newData[item]
  })

  let index = 0
  let isThis = 0
  data.map(item => {
    if(item._id != newData._id){
      index++
    }else{
      isThis = index
    }
  })

  data[isThis] = findData
  return data
}

//tool delete
function delObject(data, delData){
  return data.filter(item => item._id != delData._id)
}


//tool create
function createObject(data){
  data.id = ObjectId()
  return data
}

module.exports = {
  createObject,
  editObject,
  delObject
}
