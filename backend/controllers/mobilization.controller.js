const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mobilizationService, userService } = require('../services');
const response = require('../utils/responseTemp');
const { now } = require('moment');

/**
 * Create a mobilization and update allocation of user
 */
const createMobilization = catchAsync(async (req, res) => {
  const userModify = await userService.getUserByPk(req.user.id);
  const { userId } = req.params;
  const { currentDepartment } = req.body;
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create mobilization with this userId!');
  }
  const mobilizationBody = {
    userId,
    currentDepartment,
    lastModifiedTime: now(),
    lastModifiedBy: userModify.accountId,
  };
  const mobilization = await mobilizationService.createMobilization(mobilizationBody);
  await userService.updateUserByPk(userId, { allocation: currentDepartment }, userModify);
  res.send(response(httpStatus.CREATED, 'Create Mobilization Success', mobilization));
});

/**
 * Get all mobilizations of user
 */
const getAllMobilizations = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobilizations not found with this userId!');
  }
  const filter = pick(req.params, ['userId']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const mobilizations = await mobilizationService.getAllMobilizations(filter, options);
  res.send(response(httpStatus.OK, 'Get All Mobilizations Success', mobilizations));
});

/**
 * Get detail mobilization
 */
const getDetailMobilization = catchAsync(async (req, res) => {
  const mobilization = await mobilizationService.getMobilizationByPk(req.params.mobilizationId);
  if (!mobilization) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobilization not found!');
  }
  res.send(response(httpStatus.OK, 'Get Detail Mobilization Success', mobilization));
});

/**
 * Get all own mobilizations
 */
const getAllOwnMobilizations = catchAsync(async (req, res) => {
  const filter = { userId: req.user.id };
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const mobilizations = await mobilizationService.getAllMobilizations(filter, options);
  res.send(response(httpStatus.OK, 'Get All Own Mobilizations Success', mobilizations));
});

/**
 * Get detail own mobilization
 */
const getDetailOwnMobilization = catchAsync(async (req, res) => {
  const mobilization = await mobilizationService.getDetailOwnMobilization(req.params.mobilizationId, req.user.id);
  if (!mobilization) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobilization not found with these mobilizationId and userId!');
  }
  res.send(response(httpStatus.OK, 'Get Detail Own Mobilization Success', mobilization));
});

module.exports = {
  createMobilization,
  getAllMobilizations,
  getDetailMobilization,
  getAllOwnMobilizations,
  getDetailOwnMobilization,
};
