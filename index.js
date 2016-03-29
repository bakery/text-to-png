var httpOrHttps = require(process.env.USE_HTTPS ? 'https' : 'http');
var Canvas = require('canvas');
var url = require('url');

var server = httpOrHttps.createServer(function (request, response) {
    try {
      var queryObject = url.parse(request.url,true).query;
      console.log(queryObject);

      var text = queryObject.text || 'no text';

      var Image = Canvas.Image;
      var canvas = new Canvas(400, 200);
      var ctx = canvas.getContext('2d');

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
      var stream = canvas.createPNGStream();

      response.writeHead(200, {"Content-Type": "image/png"});
      stream.pipe(response);
    } catch(e) {
      response.end('something went wrong: ' + e.message || e.toString());
    }
    
});

server.listen(8000);