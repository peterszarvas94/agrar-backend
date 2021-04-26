const express = require('express');
const { check } = require('express-validator');

const categoryControllers = require('../controllers/category-controller');

const router = express.Router();

router.get('/', categoryControllers.getCategories);

router.get('/:id', categoryControllers.getCategory);

router.post('/',
    [ check('name').not().isEmpty() ],
    categoryControllers.addCategory
);

router.patch('/:id',
    [ check('name').not().isEmpty() ],
    categoryControllers.editOperator
);

router.delete('/:id', categoryControllers.removeCategory);

module.exports = router;