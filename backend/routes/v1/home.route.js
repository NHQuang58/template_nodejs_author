const express = require('express');
const response = require('../../utils/responseTemp');
const httpStatus = require("http-status");
const router = express.Router();

router.get('/', (req, res) => {
  res.send(response(httpStatus.OK, 'Welcome to homepage EC Tool', null));
});

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Home api
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Home test
 *     description:  For test api success
 *     tags: [Home]
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
 *                  example: Welcome
 *                 data: null
 */
