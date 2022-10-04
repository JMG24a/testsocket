const articleModel = require("../models/articles");
const formModel = require("../models/Form");

const getArticles = async () => {
  const articles = await articleModel.find();
  return articles
};

const getArticle = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const article = await articleModel.findById(id);
  return article
};

const postArticle = async (body) => {
  const { formId } = body
  try {
    const article = new articleModel(body);
    const saveObject = await article.save();

    const bodyForm = {webContentPost: saveObject.id}
    await formModel.findByIdAndUpdate(formId, bodyForm, { new: true })

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putArticle= async (id, body) => {
  const article = await getArticle(id);
  if (typeof article === 'string') {
    return article
  }

  const updateArticle = {
    author: body.author,
    title: body.title,
    tag: body.tag,
    blocks: body.blocks,
  }

  const updateForm = {
    slug: body.slug
  }

  const newArticle = await articleModel.findByIdAndUpdate(id, updateArticle, { new: true });
  await formModel.findByIdAndUpdate(body.formId, updateForm, { new: true });
  return newArticle
};

const putArticleImage = async (id, file) => {
  let fileURL = '';
  if(file){
    fileURL = `${file.filename}`
  }

  const body = {cover: file}
  const updateArticle = await articleModel.findByIdAndUpdate(id, body, { new: true });

  return {
    article: updateArticle,
  };
};

const deleteArticle = async (id) => {
  const deleteArticle = await articleModel.findByIdAndDelete(id);
  return deleteArticle ? true : false;
};

module.exports = {
  getArticles,
  getArticle,
  postArticle,
  putArticleImage,
  putArticle,
  deleteArticle
}
