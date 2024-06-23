const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.route('/')
    .post( categoryController.createCategory)
    .get(categoryController.getCategories);

router.route('/:id')
    .put( categoryController.updateCategory)
    .delete( categoryController.deleteCategory);

module.exports = router;
