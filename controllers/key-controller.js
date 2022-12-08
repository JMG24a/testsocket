const modelUser = require('../models/User')
const { v4: uuidv4 } = require('uuid');

const getKey = async(token) => {
    const user = await modelUser.findById(token.sub.id);
    const key = user.key;
    return key;
}

const generateKey = async(token) => {
    try{
        const newKey = uuidv4();
        const { key } = await articleModel.findByIdAndUpdate(token.sub.id, {key: newKey}, { new: true });
        return key
    }catch(e){
        console.log(e)
    }
}

const deleteKey = async (token) => {
    try{
        const newKey = uuidv4();
        await articleModel.findByIdAndUpdate(token.sub.id, {key: null}, { new: true });
        return true
    }catch(e){
        console.log(e)
        return false
    }
};

module.exports = {
    getKey,
    generateKey,
    deleteKey
}
