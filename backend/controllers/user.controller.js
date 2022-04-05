const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const response = require('../utils/responseTemp');
const { getArrayKeyExclude } = require('../utils/arrayUtil');
const path = require('path');
const logger = require('../config/logger');
const { lowerCaseValue } = require("../utils/characterUtil");

/**
 * Create an user
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send(response(httpStatus.CREATED, 'Create User Success', user));
});

/**
 * Get users
 */
const getUsers = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query, ['sortBy']);
  const filter = pick(req.query, ['email', 'role', 'contact']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const users = await userService.queryUsers(filter, options);
  res.send(response(httpStatus.OK, 'Query Users Success', users));
});

/**
 * Get an user
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(response(httpStatus.OK, 'Get User Success', user));
});

/**
 * Get own user
 */
const getMyProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(response(httpStatus.OK, 'Get profile success', user));
});

/**
 * Update an user
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserByPk(req.params.userId, req.body);
  res.send(response(httpStatus.OK, 'Update user success', user));
});

/**
 * Delete an user
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserByPk(req.params.userId);
  res.send(response(httpStatus.OK, 'Delete user success'));
});

/**
 * Change contact by own user
 */
const changeContact = catchAsync(async (req, res) => {
  const user = await userService.updateUserByPk(req.user.id, req.body);
  res.send(response(httpStatus.OK, 'Change contact success', user));
});

/**
 * Change username by own user
 */
const changeUsername = catchAsync(async (req, res) => {
  const user = await userService.updateUserByPk(req.user.id, req.body);
  res.send(response(httpStatus.OK, 'Change username success', user));
});

/**
 * Change password by own user
 */
const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePasswordByPk(req.user.id, req.body);
  res.send(response(httpStatus.OK, 'Change password success', user));
});

/**
 * Change avatar by own user
 */
const changeAvatar = catchAsync(async (req, res) => {
  const user = await userService.updateUserByPk(req.user.id, req.body);
  res.send(response(httpStatus.OK, 'Change avatar success', user));
});

/**
 * Change cv by own user
 */
const changeCV = catchAsync(async (req, res) => {
  const user = await userService.updateUserByPk(req.user.id, req.body);
  res.send(response(httpStatus.OK, 'Change cv success', user));
});

/**
 * Export user list to excel file
 */
const exportExcel = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  const { setSheet } = req.query;
  const columns = getArrayKeyExclude(users[0].dataValues, [
    "createdAt",
    "updatedAt",
    "id",
    "isBlackList",
    "isActive",
    "isVerify",
    "interviews",
    "mobilizationHistories",
    "requests",
    "histories",
    "avatar",
    "password"
  ])
  //get all name of sheets
  // const sheets = userService.getArrayOfSheets(setSheet, users);
  const sheets = await userService.getDataUnique(setSheet);
  if (sheets.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot find field in Db to create sheet');
  const { pathReturn, nameReturn } = await userService.exportExcel(setSheet, columns, sheets);
  if (!pathReturn) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Path not found');
  }
  let filePath = path.join(__dirname, `../../excel/${nameReturn}`);
  res.download(filePath, function (err) {
    if (err) {
      logger.error(`Sent ${filePath}`);
      throw new ApiError(httpStatus.BAD_REQUEST, 'Send Excel err:' + err);
    } else {
      logger.info(`Sent ${filePath}`);
    }
  });
});

/**
 * Update isBlacklist of user
 */
const updateIsBlacklist = catchAsync(async (req, res) => {
  const userModify = await userService.getUserByPk(req.user.id);
  const user = await userService.updateUserByPk(req.params.userId, req.body, userModify);
  res.send(response(httpStatus.OK, 'Update isBlacklist success', user));
});

/**
 * Search user
 */
const getTop = catchAsync(async (req, res) => {
  const size = req.query.size;
  const users = await userService.getTop(size);
  res.send(response(httpStatus.OK, 'Search User Success', users));
});

/**
 * Search user trained by mentorId
 */
const searchByMentor = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query);
  const filter = pick(req.query, ['mentor', 'startDate', 'endDate']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const users = await userService.searchByMentor(filter, options);
  res.send(response(httpStatus.OK, 'Search User By Mentor Success', users));
});

/**
 * Get all main skills
 */
const getAllMainSkill = catchAsync(async (req, res) => {
  const skills = await userService.getDataUnique('mainSkill');
  res.send(response(httpStatus.OK, 'Get skills Success', skills));
});

/**
 * Upload data from excel file
 */
const uploadDataUser = catchAsync(async (req, res) => {
  const data = await userService.uploadDataUser(req.file);
  res.send(response(httpStatus.OK, 'uploadDataUser Success', data));
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMyProfile,
  changeContact,
  changePassword,
  changeUsername,
  changeAvatar,
  changeCV,
  exportExcel,
  updateIsBlacklist,
  getTop,
  searchByMentor,
  getAllMainSkill,
  uploadDataUser,
};
