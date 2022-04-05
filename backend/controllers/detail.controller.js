const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { detailService, userService } = require('../services');
const response = require('../utils/responseTemp');
const path = require('path');
const logger = require('../config/logger');

/**
 * Get detail account
 */
const getDetailAccount = catchAsync(async (req, res) => {
  const user = await detailService.getDetailAccountByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found!');
  }
  res.send(response(httpStatus.OK, 'Get Detail Account Success', user));
});

/**
 * Get evaluation
 */
const getEvaluation = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found!');
  }
  res.send(response(httpStatus.OK, 'Get Evaluation Success', user.evaluation));
});

/**
 * Get allocation
 */
const getAllocation = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found!');
  }
  res.send(response(httpStatus.OK, 'Get Allocation Success', user.allocation));
});

/**
 * Get CV
 */
const getCv = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found!');
  }
  res.send(response(httpStatus.OK, 'Get CV Success', user.cv));
});

/**
 * Export detail information of user to Excel file
 */
const exportExcel = catchAsync(async (req, res) => {
  const user = await detailService.getDetailAccountByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found!');
  }
  if (user.dataValues.requests.length > 0) {
    user.dataValues.requests = user.dataValues.requests.map((cur) => {
      const { requestDetail, approver, totalDuration, detailReason, delegateTo, status } = cur.dataValues;
      const { supervisor, reason, supervisorFullName, approverFullName, startDate, endDate, requester } =
        requestDetail.dataValues;
      const newRequest = {
        approver,
        totalDuration,
        detailReason,
        delegateTo,
        status,
        supervisor,
        reason,
        supervisorFullName,
        approverFullName,
        startDate,
        endDate,
        requester,
      };
      return newRequest;
    });
  }
  //get all name of sheets
  const sheets = ['Account', 'interviews', 'mobilizationHistories', 'requests', 'histories'];
  const { pathReturn, nameReturn } = await detailService.exportExcel(user.dataValues, sheets);
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
module.exports = {
  getDetailAccount,
  getEvaluation,
  getAllocation,
  getCv,
  exportExcel,
};
