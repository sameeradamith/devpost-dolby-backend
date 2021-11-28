var express = require('express');
var router = express.Router();

var enableVideo = is_enable_video;
var enableScreenShare = is_enable_screens_share;
var enableRecording = is_enable_recording;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/meeting', function(req, res, next) {
  res.render('meeting', { isVideo: enableVideo, isScreenShare: enableScreenShare, isRecording: enableRecording });
});

module.exports = router;
