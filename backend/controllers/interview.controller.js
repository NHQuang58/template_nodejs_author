const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { interviewService, userService } = require('../services');
const response = require('../utils/responseTemp');

/**
 * Create an interview
 */
const createInterview = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create interview with this userId!')
  }
  const interviewBody = { ...req.body, userId: req.params.userId };
  const interview = await interviewService.createInterview(interviewBody);
  res.send(response(httpStatus.CREATED, 'Create Interview Success', interview));
});

/**
 * Get all interviews of user
 */
const getAllInterviews = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Interviews not found with this userId!')
  }
  const filter = pick(req.params, ['userId']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const interviews = await interviewService.getAllInterviews(filter, options)
  res.send(response(httpStatus.OK, 'Get All Interviews Success', interviews));
});

/**
 * Get detail interview
 */
const getDetailInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.getInterviewByPk(req.params.interviewId);
  if (!interview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Interview not found!')
  }
  res.send(response(httpStatus.OK, 'Get Detail Interview Success', interview));
});

/**
 * Update an interview
 */
const updateInterview = catchAsync(async (req, res) => {
  const user = await interviewService.updateInterviewByPk(req.params.interviewId, req.body);
  res.send(response(httpStatus.OK, 'Update interview success', user));
});

/**
 * Get all own interviews
 */
const getAllOwnInterviews = catchAsync(async (req, res) => {
  const filter = { userId: req.user.id };
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const interviews = await interviewService.getAllInterviews(filter, options)
  res.send(response(httpStatus.OK, 'Get All Own Interviews Success', interviews));
});

/**
 * Get detail own interview
 */
const getDetailOwnInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.getDetailOwnInterview(req.params.interviewId, req.user.id);
  if (!interview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Interview not found with these interviewId and userId!')
  }
  res.send(response(httpStatus.OK, 'Get Detail Own Interview Success', interview));
});

module.exports = {
  createInterview,
  getAllInterviews,
  getDetailInterview,
  updateInterview,
  getAllOwnInterviews,
  getDetailOwnInterview,
};
