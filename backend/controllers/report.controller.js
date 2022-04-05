const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reportService, userService } = require('../services');
const response = require('../utils/responseTemp');
const { getArrayKeyExclude } = require('../utils/arrayUtil');
const path = require('path');
const logger = require('../config/logger');
const { lowerCaseValue, upperCaseAfterChar, capitalizeFirstLetter } = require("../utils/characterUtil");

/**
 * Get new users follow skills and site and range day onboard
 */
const getNewUsers = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query, ['sortBy']);
  const filter = pick(req.query, ['mainSkill', 'site']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const rangeDay = parseInt(req.query.rangeDay, 10);
  const users = await reportService.getNewUsers(filter, options, rangeDay);
  res.send(response(httpStatus.OK, 'Query New Users Success', users));
});

/**
 * Get users follow skills and site
 */
const getMembers = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query, ['sortBy']);
  const filter = pick(req.query, ['mainSkill', 'site']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const users = await userService.queryUsers(filter, options);
  res.send(response(httpStatus.OK, 'Query Users Success', users));
});

/**
 * Get users follow skills and site
 */
const getMembersMobilization = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query, ['sortBy']);
  const filter = pick(req.query, ['site']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const users = await reportService.getMembersMobilization(filter, options);
  res.send(response(httpStatus.OK, 'Query users transferred Success', users));
});

/**
 * Export new users each site to Excel file
 */
const exportNewUsers = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query);
  const filter = pick(req.query, ['mainSkill', 'site']);
  const option = pick(req.query, ['order', 'sortBy']);
  const rangeDay = parseInt(req.query.rangeDay, 10);
  const users = await reportService.getNewUsersToExport(filter, option, rangeDay);
  const columns = getArrayKeyExclude(users.rows[0].dataValues, [
    "createdAt",
    "updatedAt",
    "id",
    "isBlackList",
    "isActive",
    "isVerify",
    'avatar',
    "parentDepartmentName",
    "childDepartmentName",
    "address",
    "site",
    "password"
  ]);
  let pathReturn;
  let nameReturn;
  //if admin want to export specific main skill of site
  if (filter.mainSkill) {
    //get name of sheet
    let sheetName = `${req.query.site} ${req.query.mainSkill}`;
    sheetName = upperCaseAfterChar(sheetName, ' ');
    sheetName = capitalizeFirstLetter(sheetName);
    const dataReturn = await reportService.exportExcelSpecific(users, columns, sheetName);
    pathReturn = dataReturn.pathReturn;
    nameReturn = dataReturn.nameReturn;
  } else { // admin want to export all main skill of site
    //get all name of sheets
    const sheets = userService.getArrayOfSheets('mainSkill', users.rows);
    const dataReturn = await reportService.exportExcelSetField(users, columns, sheets, 'mainSkill');
    pathReturn = dataReturn.pathReturn;
    nameReturn = dataReturn.nameReturn;
  }
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
 * Export users each site to Excel file
 */
const exportMembers = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query);
  const filter = pick(req.query, ['mainSkill', 'site']);
  const option = pick(req.query, ['order', 'sortBy']);
  const data = await reportService.getUsersToExport(filter, option);

  //convert interviews properties of data from DB to departments
  data.rows.forEach((cur, index, arr) => {
    if (cur.dataValues.interviews.length > 0) {
      const newInterviewList = cur.dataValues.interviews.map((interview) => {
        return interview.dataValues.interviewDepartment;
      })
      arr[index].dataValues.interviews = [ ...newInterviewList ];
    }
  });
  const users = {...data};
  const columns = getArrayKeyExclude(users.rows[0].dataValues, [
    "createdAt",
    "updatedAt",
    "id",
    "role",
    "email",
    "phoneNumber",
    "dob",
    "workplace",
    "nationality",
    "mentorFullName",
    "cv",
    "type",
    "age",
    "address",
    "isBlackList",
    "isActive",
    "isVerify",
    'avatar',
    "parentDepartmentName",
    "childDepartmentName",
    'avatar',
    "site",
    "password"
  ]);
  let pathReturn;
  let nameReturn;
  //if admin want to export specific main skill of site
  if (filter.mainSkill) {
    //get name of sheet
    let sheetName = `${req.query.site} ${req.query.mainSkill}`;
    sheetName = upperCaseAfterChar(sheetName, ' ');
    sheetName = capitalizeFirstLetter(sheetName);
    const dataReturn = await reportService.exportExcelSpecific(users, columns, sheetName);
    pathReturn = dataReturn.pathReturn;
    nameReturn = dataReturn.nameReturn;
  } else { // admin want to export all main skill of site
    //get all name of sheets
    const sheets = userService.getArrayOfSheets('mainSkill', users.rows);
    const dataReturn = await reportService.exportExcelSetField(users, columns, sheets, "mainSkill");
    pathReturn = dataReturn.pathReturn;
    nameReturn = dataReturn.nameReturn;
  }
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
 * Export users mobilization each site to Excel file
 */
const exportMembersMobilization = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query);
  const filter = pick(req.query, ['site']);
  const option = pick(req.query, ['order', 'sortBy']);
  const users = await reportService.getMembersMobilizationToExport(filter, option);
  const columns = getArrayKeyExclude(users.rows[0].dataValues, [
    "createdAt",
    "updatedAt",
    "id",
    "isBlackList",
    "isActive",
    "isVerify",
    'avatar',
    "parentDepartmentName",
    "childDepartmentName",
    "site",
    "password"
  ]);
  let pathReturn;
  let nameReturn;
  //if admin want to export specific site
  if (filter.site) {
    //get name of sheet
    let sheetName = `${req.query.site}`;
    sheetName = upperCaseAfterChar(sheetName, ' ');
    sheetName = capitalizeFirstLetter(sheetName);
    const dataReturn = await reportService.exportExcelSpecific(users, columns, sheetName);
    pathReturn = dataReturn.pathReturn;
    nameReturn = dataReturn.nameReturn;
  } else { // admin want to export all site
    //get all name of sheets
    const sheets = userService.getArrayOfSheets('site', users.rows);
    const dataReturn = await reportService.exportExcelSetField(users, columns, sheets, 'site');
    pathReturn = dataReturn.pathReturn;
    nameReturn = dataReturn.nameReturn;
  }
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
 * Export users trained by a mentor
 */
const exportByMentor = catchAsync(async (req, res) => {
  req.query = lowerCaseValue(req.query);
  const filter = pick(req.query, ['mentor', 'startDate', 'endDate']);
  const option = pick(req.query, ['order', 'sortBy']);
  const users = await reportService.getUsersByMentor(filter, option);
  const columns = ['accountId', 'fullName', 'mainSkill', 'extraSkill', 'phoneNumber', 'fullDepartmentName', 'mentor', 'mentorFullName', 'cv', 'evaluation'];
  let sheetName = `trainedBy_${req.query.mentor}`;
  const { pathReturn, nameReturn } = await reportService.exportExcelSpecific(users, columns, sheetName);
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
  getNewUsers,
  getMembers,
  getMembersMobilization,
  exportNewUsers,
  exportMembers,
  exportMembersMobilization,
  exportByMentor,
};
