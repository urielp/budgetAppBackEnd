var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('index');
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }

    req.session.lastVisit = new Date();
    console.log(req.session.lastVisit);
  res.render('index', { title: 'Express',lastVisit:req.session.lastVisit });
});

router.get('/d', function(req, res, next) {
    res.redirect(403,'http://www.walla.co.il')
});

module.exports = router;
