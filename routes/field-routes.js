const express = require('express');
const { check } = require('express-validator');

const fieldControllers = require('../controllers/field-controller');

const router = express.Router();

router.get('/', fieldControllers.getFields);

router.get('/:id', fieldControllers.getField);

router.get('/operation/:id', fieldControllers.getFieldByOperation);

router.post('/',
    [
        check('name').notEmpty(),
        check('area').notEmpty().isNumeric()
    ],
    fieldControllers.addField
);

router.patch('/:id',
    [
        check('name').notEmpty(),
        check('area').notEmpty().isNumeric()
    ],
    fieldControllers.editField
);

router.delete('/:id', fieldControllers.removeField);

module.exports = router;