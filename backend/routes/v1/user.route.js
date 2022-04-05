const express = require('express');
const authorMinRole = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const upload = require('../../middlewares/multer');
const router = express.Router();

router
  .route('/admin')
  .post(authorMinRole('admin'), validate(userValidation.createUser), userController.createUser)
  .get(authorMinRole('admin'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/get-top').get(validate(userValidation.getTop), userController.getTop);

router
  .route('/my-profile').get(authorMinRole(), userController.getMyProfile);

router
  .route('/change-contact').patch(authorMinRole(), validate(userValidation.changeContact), userController.changeContact);

router
  .route('/change-username').patch(authorMinRole(), validate(userValidation.changeUsername), userController.changeUsername);

router
  .route('/change-password').patch(authorMinRole(), validate(userValidation.changePassword), userController.changePassword);

router
  .route('/change-avatar').patch(authorMinRole(), validate(userValidation.changeAvatar), userController.changeAvatar);

router
  .route('/change-cv').patch(authorMinRole(), validate(userValidation.changeCV), userController.changeCV);

// router
//   .route('/test-upload').post(upload.single('file'), userController.uploadDataUser);

router
  .route('/admin/:userId')
  .get(authorMinRole('admin'), validate(userValidation.getUser), userController.getUser)
  .patch(authorMinRole('admin'), validate(userValidation.updateUser), userController.updateUser)
  .delete(authorMinRole('admin'), validate(userValidation.deleteUser), userController.deleteUser);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create an user
 *     description: Only admins can create other users, input date format mm/dd/yyyy
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       "201":
 *         description: Register success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 201
 *                 message:
 *                  type: string
 *                  example: Created user success
 *                 data:
 *                  type: object
 *                  $ref: '#/components/schemas/user'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get users, if query and body are empty, this api will get all user not filter
 *     description: Only admins can retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: use this field for sort (ex. level)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: order for sort (asc or desc)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users in a page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: accountId
 *         schema:
 *           type: string
 *         description: accountId of user (ex. QuangNh33)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: email of user (ex. exam@gmail.com)
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: full name of user (ex. Nguyen Van A)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: role user (ex. user)
 *       - in: query
 *         name: mainSkill
 *         schema:
 *           type: string
 *         description: main skill of user (ex. ReactJs)
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: number phone (ex. "+84123456789")
 *       - in: query
 *         name: site
 *         schema:
 *           type: string
 *         description: site of user (ex. Hà Nội)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Query Users Success
 *                 data:
 *                  type: object
 *                  properties:
 *                    total:
 *                      type: integer
 *                      example: 100
 *                    result:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/user'
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get an user
 *     description:  Only admins can fetch other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Get user success
 *                 data:
 *                  type: object
 *                  $ref: '#/components/schemas/user'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an user
 *     description: Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: User id want to update
 *     requestBody:
 *       required: true
 *       description: Update any field of user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              level:
 *                type: integer,
 *                example: 6
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/user'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an user
 *     description: Only admins can delete other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User id want to delete
 *     responses:
 *       "200":
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Delete user success
 *                 data:
 *                  type: string
 *                  example: null
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/update-blacklist/{userId}:
 *   patch:
 *     summary: Update isBlackList of an user
 *     description:  Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: User id
 *     requestBody:
 *       required: true
 *       description: Update isBlacklist field of user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              isBlackList:
 *                type: boolean
 *                example: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Update isBlacklist success
 *                 data:
 *                  type: object
 *                  $ref: '#/components/schemas/user'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/export-excel:
 *   get:
 *     summary: Download user's Excel file
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *         - application/msexcel
 *     parameters:
 *       - in: query
 *         name: setSheet
 *         schema:
 *           type: string
 *         default: mainSkill
 *         description: use this field for set sheet (ex. mainSkill)
 *     responses:
 *       "200":
 *         description: OK
 *         schema:
 *          type: file
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Get users by keyword, 'term' is required
 *     description: Anyone can see all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         required: true
 *         name: term
 *         schema:
 *           type: string
 *         description: use this field for search (ex. Quang)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: use this field for sort (ex. level)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: order for sort (asc or desc)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users in a page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Search Users Success
 *                 data:
 *                  type: object
 *                  properties:
 *                    total:
 *                      type: integer
 *                      example: 100
 *                    result:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/user'
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /users/search-by-mentor:
 *   get:
 *     summary: Get users trained by a mentor
 *     description: Only admin can get users trained by a mentor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         required: true
 *         name: mentor
 *         schema:
 *           type: string
 *         description: this is mentor id (ex. tuandv32)
 *       - in: query
 *         required: true
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: this is start date want to check(ex. 2022-02-25)
 *       - in: query
 *         required: true
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: this is start date want to check(ex. 2022-03-04)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: use this field for sort (ex. level)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: order for sort (asc or desc)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users in a page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Search User By Mentor Success
 *                 data:
 *                  type: object
 *                  properties:
 *                    total:
 *                      type: integer
 *                      example: 100
 *                    result:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/user'
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /users/get-all-mainSkill:
 *   get:
 *     summary: Get all main skill of users in db
 *     description: Anyone can see all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: integer
 *                  example: 200
 *                 message:
 *                  type: string
 *                  example: Get skills Success
 *                 data:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ['reactjs', 'java']
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
