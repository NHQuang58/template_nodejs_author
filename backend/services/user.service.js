const httpStatus = require('http-status');
const excelJS = require('exceljs');
const path = require('path');
const { now } = require('moment');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const readXlsxFile = require('read-excel-file/node');
const { users, tokens } = require('../models');
const paginationService = require('./pagination.service');
const ApiError = require('../utils/ApiError');
const { capitalizeFirstLetter, numberToAlphabet, lowerCaseValue } = require('../utils/characterUtil');
const { validateArray } = require('../utils/arrayUtil');
const { tokenTypes } = require("../config/tokens");
/**
 * Create an user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // eslint-disable-next-line no-param-reassign
  userBody = lowerCaseValue(userBody, ['password', 'cv', 'avatar', 'username']);
  if (await users.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email address already in use!');
  }
  if (userBody.contact && (await users.isContactTaken(userBody.contact))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact already in use!');
  }
  return users.create({ ...userBody });
};

/**
 * Query user
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<{result: *, total: *, totalPages: number, currentPage: number}>}
 */
const queryUsers = async (filter, options) => {
  const page = parseInt(options.page, 10);
  const size = parseInt(options.size, 10);
  const { limit, offset } = paginationService.getPagination(page, size);
  // eslint-disable-next-line no-param-reassign
  if (!options.sortBy) options.sortBy = 'createdAt';
  // eslint-disable-next-line no-param-reassign
  if (!options.order) options.order = 'desc';
  const data = await users.findAndCountAll({
    where: filter,
    limit,
    offset,
    order: [[options.sortBy, options.order]],
    attributes: { exclude: ['password'] },
    distinct: true,
  });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users not found');
  }
  return paginationService.getPagingData(data, page, limit);
};

/**
 * Get user by pk
 */
const getUserByPk = async (id) => {
  return users.findByPk(id);
};

/**
 * Get user by email
 */
const getUserByEmail = async (_email) => {
  return users.findOne({ where: { email: _email } });
};

/**
 * Update user by pk
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<users>}
 */
const updateUserByPk = async (userId, updateBody) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await users.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email address already in use!');
  }
  if (updateBody.contact && (await users.isContactTaken(updateBody.contact))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact already in use!');
  }
  // eslint-disable-next-line no-param-reassign
  updateBody = lowerCaseValue(updateBody, ['password', 'cv', 'avatar', 'username']);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update user by email
 * @param {string} email
 * @param {Object} updateBody
 * @returns {Promise<user>}
 */
const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (updateBody.email && (await users.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email address already in use!');
  }
  if (updateBody.phoneNumber && (await users.isContactTaken(updateBody.phoneNumber))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact already in use!');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by Pk
 */
const deleteUserByPk = async (userId) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};
/**
 * Update password by pk
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const changePasswordByPk = async (userId, body) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isOldPasswordCorrect = await user.checkPassword(body.oldPassword, user.password);
  if (!isOldPasswordCorrect) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Old password is not correct');
  }
  user.password = body.newPassword;
  await user.save();
  return user;
};
/**
 * Get all users
 * @returns {Promise<users>}
 */
const getAllUsers = async () => {
  return users.findAll();
};
/**
 * Get users by filter
 * @returns {Promise<user>}
 */
const getUsersByFilter = async (filter) => {
  return users.findAndCountAll({
    where: filter,
    attributes: { exclude: ['password'] },
  });
};

/**
 * Export Excel File
 * @param {String} setSheet
 * @param {Array} columns
 * @param {Array} sheets
 * @returns {Promise<{pathReturn: string, nameReturn: string}>}
 */
const exportExcel = async (setSheet, columns, sheets) => {
  const workbook = new excelJS.Workbook();
  const excelColumns = columns.map((cur) => {
    const column = { header: capitalizeFirstLetter(cur), key: cur, width: 20 };
    if (cur === 'email') column.width = 50;
    if (cur === 'fullDepartmentName') column.width = 50;
    return column;
  });
  excelColumns.unshift({ header: 'No.', key: 's_no', width: 10 });
  for (const curSheet of sheets) {
    const worksheet = workbook.addWorksheet(curSheet);
    const dataset = await getUsersByFilter({ [setSheet]: curSheet });
    worksheet.columns = [...excelColumns];
    let counter = 1;
    dataset.rows.forEach((data) => {
      data.s_no = counter;
      if (data.extraSkill) data.extraSkill = data.extraSkill.join();
      worksheet.addRow(data);
      counter++;
    });
    // add auto filter in header of file excel
    worksheet.autoFilter = `A1:${numberToAlphabet(excelColumns.length)}1`;
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (rowNumber === 1) {
          // first row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f5b914' },
          };
          cell.font = { bold: true };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      row.commit();
    });
    // merge by start row, start column, end row, end column
    worksheet.mergeCells(counter + 1, 1, counter + 1, excelColumns.length);
    worksheet.getCell(`A${counter + 1}`).value = `Total of account: ${dataset.count}`;
    worksheet.getCell(`A${counter + 1}`).alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell(`A${counter + 1}`).font = { bold: true };
  }
  const dir = path.join(__dirname, '../../excel');
  // const time = now();
  const time = 'export_user';
  try {
    await workbook.xlsx.writeFile(`${dir}/${time}.xlsx`);
    const pathReturn = `${dir}/${time}.xlsx`;
    return { pathReturn, nameReturn: `${time}.xlsx` };
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Export fail: ${err}`);
  }
};

/**
 * get Top score
 * @param {Number} size
 * @returns {Promise<Model<any, TModelAttributes>[]>}
 */
const getTop = async (size) => {
  if (!size) size = 10;
  const data = await users.findAll({
    limit: size,
    order: [
      ['exam_score', 'desc'],
      ['exam_time', 'asc']
    ],
    attributes: { exclude: ['password'] },
  });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users not found');
  }
  return data;
};

/**
 * Search user trained by mentorId
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<{result: *, total: *, totalPages: number, currentPage: number}>}
 */
const searchByMentor = async (filter, options) => {
  const page = parseInt(options.page, 10);
  const size = parseInt(options.size, 10);
  const { limit, offset } = paginationService.getPagination(page, size);
  if (!options.sortBy) options.sortBy = 'createdAt';
  if (!options.order) options.order = 'desc';

  const data = await users.findAndCountAll({
    where: { onboardDay: { [Op.between]: [filter.startDate, filter.endDate] }, mentor: filter.mentor },
    limit,
    offset,
    order: [[options.sortBy, options.order]],
    attributes: { exclude: ['password'] },
  });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users not found');
  }
  return paginationService.getPagingData(data, page, limit);
};

/**
 * Get distinct of column
 * @param {String} column
 * @returns {Array}
 */
const getDataUnique = async (column) => {
  // attributes: [[sequelize.fn('DISTINCT', sequelize.col('col_name')), 'alias_name']],
  const data = await users.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col(column)), column]] });
  const returnValue = data.map((cur) => {
    return cur[column];
  });
  return returnValue;
};
// const filePath = require('../../excel');
/**
 * upload Data user
 * @param {File} file
 * @returns {Array}
 */
const uploadDataUser = async (file) => {
  try {
    if (file === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File not found');
    }
    const filePath = path.join(__dirname, '../../excel');
    const rows = await readXlsxFile(`${filePath}/data_upload.xlsx`);
    // const headerCheck = ['accountId', 'role', 'email', 'password', 'dob', 'age', 'fullName'];
    const headerCheck = ['difficult_level', 'category', 'time', 'content', 'number_answers', 'number_correct'];
    const { missingElements, falseElements } = validateArray([...rows[0]], [...headerCheck]);
    if (missingElements.length > 0 || falseElements.length > 0) {
      let error = '';
      if (missingElements.length > 0) {
        error += `${missingElements.join(', ')} missing; `;
      }
      if (falseElements.length > 0) {
        error += `${falseElements.join(', ')} wrong position `;
      }
      throw new ApiError(httpStatus.BAD_REQUEST, `Header error: ${error}`);
    }
    rows.shift();
    const questionList = rows.map((row) => {
      const objectReturn = {
        question: {},
        answers: [],
      };
      const question = {
        difficult_level: row[0],
        category_id: row[1],
        time: row[2],
        content: row[3],
      };
      objectReturn.question = { ...question };
      const number_answers = row[4];
      const number_correct = row[5];
      const answers = [];
      for (let indexAnswer = 0; indexAnswer < number_answers; indexAnswer++) {
        const answer = {
          content: '',
          isCorrect: false,
        };
        // get content of answer in column answer
        answer.content = row[6 + indexAnswer];
        // if this answer is correct
        if (indexAnswer < number_correct) {
          answer.isCorrect = true;
        }
        answers.push(answer);
      }
      objectReturn.answers = [...answers];
      return objectReturn;
    });
    return questionList;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Upload fail: ${error}`);
  }
};
/**
 * Update email token by userId and deviceId
 * @param {Number} id
 * @param {string} type
 * @param token
 * @returns {Promise<Tokens>}
 */
const updateEmailTokenByUserId = async (id,  token) => {
  const tokenDoc = await tokens.findOne({ where: { user_id: id, token, type: tokenTypes.VERIFY_EMAIL} });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  tokenDoc.verifyEmailToken = token;
  await tokenDoc.save();
  return tokenDoc;
};
module.exports = {
  createUser,
  queryUsers,
  getUserByPk,
  getUserByEmail,
  updateUserByPk,
  deleteUserByPk,
  changePasswordByPk,
  updateUserByEmail,
  getAllUsers,
  getUsersByFilter,
  exportExcel,
  getTop,
  searchByMentor,
  getDataUnique,
  uploadDataUser,
  updateEmailTokenByUserId,
};
