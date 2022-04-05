const Joi = require('joi');
const { isRole, numberPhone } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    role: Joi.string().optional().custom(isRole),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().optional(),
    contact: Joi.string().optional().custom(numberPhone),
    exam_score: Joi.number().optional(),
    exam_time: Joi.number().optional(),
    number_exam: Joi.number().optional(),
    contribution_score: Joi.number().optional(),
    is_email_verified: Joi.boolean().optional(),
    is_contact_verified: Joi.boolean().optional(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string().optional(),
    order: Joi.string().optional().valid('asc', 'desc'),
    size: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
    email: Joi.string().optional().email(),
    role: Joi.string().optional().custom(isRole),
    contact: Joi.string().optional().custom(numberPhone),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      role: Joi.string().optional().custom(isRole),
      username: Joi.string().optional(),
      email: Joi.string().optional().email(),
      password: Joi.string().optional(),
      avatar: Joi.string().optional(),
      contact: Joi.string().optional().custom(numberPhone),
      exam_score: Joi.number().optional(),
      exam_time: Joi.number().optional(),
      number_exam: Joi.number().optional(),
      contribution_score: Joi.number().optional(),
      is_email_verified: Joi.boolean().optional(),
      is_contact_verified: Joi.boolean().optional(),
    })
    .min(1),
};

const deleteUser= {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
};
const changeContact = {
  body: Joi.object().keys({
    contact:  Joi.string().required().custom(numberPhone),
  }),
};
const changeEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
const changeUsername = {
  body: Joi.object().keys({
    username: Joi.string().required(),
  }),
};
const myProfile = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
};
const changeAvatar = {
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
};
const changeCV = {
  body: Joi.object().keys({
    cv: Joi.string().required(),
  }),
};

const exportUsers = {
  query: Joi.object().keys({
    setSheet: Joi.string().required(),
  })
};

const updateIsBlacklist = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    isBlackList: Joi.boolean().required(),
  }),
};

const getTop = {
  query: Joi.object().keys({
    size: Joi.number().integer().optional(),
  })
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeContact,
  changeEmail,
  changePassword,
  changeUsername,
  changeAvatar,
  changeCV,
  exportUsers,
  updateIsBlacklist,
  getTop,
  myProfile,
};
