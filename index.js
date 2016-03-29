var express = require('express');
var Canvas = require('canvas');
var url = require('url');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');

app.get('/', function(request, response) {
  try {
    var queryObject = url.parse(request.url,true).query;
    console.log(queryObject);

    var text = queryObject.text || 'no text';

    var Image = Canvas.Image;
    var canvas = new Canvas(400, 200);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,400,200);

    ctx.fillStyle = "#000000";
    ctx.font = '14px fontOpenSans';

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
    }
      
    wrapText(ctx, text, (400-360)/2, 60, 360, 20);
    

    if (queryObject.base64) {
      canvas.toDataURL('image/png', function(err, png){ 
        if (!err) {
          response.end(png);
        } else {
          response.end('problem generating png: ' + err.toString());
        }
      });
    } else {
      var stream = canvas.createPNGStream();
      response.writeHead(200, {"Content-Type": "image/png"});
      stream.pipe(response);
    }
  } catch(e) {
    response.end('something went wrong: ' + e.message || e.toString());
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


