const express = require('express');
const { check } = require('express-validator');

const operatorsControllers = require('../controllers/operator-controller');

const router = express.Router();

router.get('/', operatorsControllers.getOperators);
router.get('/:id', operatorsControllers.getOperator);

router.post('/',
    [
        check('name').not().isEmpty()
    ],
    operatorsControllers.addOperator
);

router.patch('/:id',
    [
        check('name').not().isEmpty()
    ],
    operatorsControllers.editOperator
);

router.delete('/:id', operatorsControllers.removeOperator);

module.exports = router;