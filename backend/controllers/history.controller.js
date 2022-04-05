const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, historyService, interviewService } = require('../services');
const response = require('../utils/responseTemp');

/**
 * Get all histories of user
 */
const getAllHistories = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Histories not found with this userId!')
  }
  const filter = pick(req.params, ['userId']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const histories = await historyService.getAllHistories(filter, options)
  res.send(response(httpStatus.OK, 'Get All Histories Success', histories));
});

/**
 * Get detail history
 */
const getDetailHistory = catchAsync(async (req, res) => {
  const history = await historyService.getHistoryByPk(req.params.historyId);
  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'History not found!')
  }
  res.send(response(httpStatus.OK, 'Get Detail History Success', history));
});

module.exports = {
  getAllHistories,
  getDetailHistory,
};
