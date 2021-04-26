const express = require('express');

const recordsController = require('../controllers/record-controller');

const router = express.Router();

router.get('/:id', recordsController.getRecord);

router.get('/entrie/:id', recordsController.getRecordsByEntrie);

router.post('/', recordsController.addRecord);

router.patch('/:id', recordsController.editRecord);

router.delete('/:id', recordsController.removeRecord);

module.exports = router;