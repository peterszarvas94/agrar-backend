const express = require('express');

const operationControllers = require('../controllers/operation-controller');

const router = express.Router();

router.get('/:id', operationControllers.getOperation);

router.get('/record/:id', operationControllers.getOperationByRecord);

router.get('/operator/:id', operationControllers.getOperationsByOperator);

router.post('/', operationControllers.addOperation);

router.patch('/:id', operationControllers.editOperation);

router.delete('/:id', operationControllers.removeOperation);

module.exports = router;