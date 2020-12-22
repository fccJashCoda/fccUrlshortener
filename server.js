require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { Schema } = mongoose;
// Basic Configuration
const port = process.env.PORT || 3000;

const shortUrlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  },
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

const shorten = () => {
  const getLetter = () =>
    String.fromCharCode(Math.floor(Math.random() * (123 - 97) + 97));
  const idNum = Math.floor(Math.random() * 1000);

  return `${getLetter()}${getLetter()}${idNum}`;
};

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/new', (req, res) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

  if (!req.body.url || !req.body.url.match(regex)) {
    return res.json({ error: 'invalid url' });
  }

  ShortUrl.findOne({ original_url: req.body.url })
    .select('-_id original_url short_url')
    .exec((err, url) => {
      if (err) {
        return res.json({ error: 'Server Error' });
      }
      if (url) {
        console.log('url exists');
        return res.json(url);
      }

      console.log('creating url');
      const newShortUrl = new ShortUrl({
        original_url: req.body.url,
        short_url: shorten(),
      });

      newShortUrl
        .save()
        .then((url) =>
          res.json({ original_url: url.original_url, short_url: url.short_url })
        )
        .catch((err) => res.json({ error: 'Server Error' }));
    });
});

app.get(`/api/shorturl/:shortcut`, (req, res) => {
  ShortUrl.findOne({ short_url: req.params.shortcut })
    .select('-_id original_url short_url')
    .exec((err, url) => {
      if (err) {
        return res.json({ error: 'Server Error' });
      }
      if (url) {
        console.log(url);
        return res.redirect(url.original_url);
      }

      return res.json({ error: 'invalid url ' });
    });
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    })
  );
