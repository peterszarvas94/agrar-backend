const express = require('express');
const { check } = require('express-validator');

const entrieControllers = require('../controllers/entrie-controller');

const router = express.Router();

router.get('/:id', entrieControllers.getEntrie);

router.get('/category/:id', entrieControllers.getEntriesByCategory);

router.post('/',
    [
        check('name').notEmpty(),
        check('price').notEmpty().isNumeric(),
        check('category').notEmpty(),
        check('type').notEmpty().isBoolean()
    ],
    entrieControllers.addEntrie
);

router.patch('/:id',
    [
        check('name').notEmpty(),
        check('price').notEmpty().isNumeric(),
        check('category').notEmpty(),
        check('type').notEmpty().isBoolean()
    ],
    entrieControllers.editEntrie
);

router.delete('/:id', entrieControllers.removeEntrie);

module.exports = router;