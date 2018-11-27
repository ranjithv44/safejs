var express = require('express');
var app = express();

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    maxAge: '1d',
    redirect: false
  }

  app.use(express.static('public',options));

  app.listen(3000);

  console.log("Server listening on port 3000");