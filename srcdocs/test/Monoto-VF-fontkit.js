//<script type="text/javascript" src="fontkit.js">
var fontkit = require('fontkit');

function adtLoadPanel (fkFontPath) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', fkFontPath, true)
  xhr.responseType = 'arraybuffer'

  var fkFont = null

  xhr.onload = function (e) {
    if (this.status == 200) {
      var fkBlob = this.response
      var fkBuffer = new Buffer(fkBlob)
      fkFont = fontkit.create(fkBuffer);
      console.log(fkFont.postscriptName);
      console.log('fkFont.postscriptName');
    }
  }

  xhr.send();
}

var fkFont = adtLoadPanel('fonts/Monoto-VF.woff');