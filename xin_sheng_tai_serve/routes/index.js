var express = require('express');
var router = express.Router();
var cate = require('../controllers/cateController.js');


/* GET home page. */
router.get('/',cate.getCate);
router.get('/getPostCate',cate.getPostCate);
router.get('/foo/home/banner',cate.getBanner);

module.exports = router;
