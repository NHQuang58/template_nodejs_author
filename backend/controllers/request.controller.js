const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, requestService } = require('../services');
const response = require('../utils/responseTemp');

/**
 * Create a request
 */
const createRequest = catchAsync(async (req, res) => {
  const { requestDetail, request } = req.body;
  const requestSuccess = await requestService.createRequest(request);
  const requestDetailBody = { ...requestDetail, requestId: requestSuccess.id };
  const requestDetailSuccess = await requestService.createRequestDetail(requestDetailBody);
  res.send(
    response(httpStatus.CREATED, 'Create Request Success', {
      request: requestSuccess,
      requestDetail: requestDetailSuccess,
    })
  );
});

/**
 * Get all requests of user
 */
const getAllRequests = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot get request with this userId!');
  }
  const filter = pick(req.params, ['userId']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const requests = await requestService.getAllRequests(filter, options);
  res.send(response(httpStatus.OK, 'Get All Requests Success', requests));
});

/**
 * Get detail request
 */
const getDetailRequest = catchAsync(async (req, res) => {
  const request = await requestService.getRequestByPk(req.params.requestId);
  if (!request) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request not found!');
  }
  res.send(response(httpStatus.OK, 'Get Detail Request Success', request));
});

module.exports = {
  createRequest,
  getAllRequests,
  getDetailRequest,
};
