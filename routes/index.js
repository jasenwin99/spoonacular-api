var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const get_token = () => {
  let tokens = require("./token")
  return tokens[Math.floor(Math.random() * tokens.length)]
}
const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

const tagOrComment = new RegExp(
  '<(?:'
  // Comment body.
  + '!--(?:(?:-*[^->])*--+|-?)'
  // Special "raw text" elements whose content should be elided.
  + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
  + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
  // Regular name
  + '|/?[a-z]'
  + tagBody
  + ')>',
  'gi');
const removeTags = (html) => {
  let oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}

/* GET home page. */
router.get('/searchrecipe', (req, res, next) => {
  let url = 'https://api.spoonacular.com/recipes/complexSearch';
  axios.get(url, {
    params: {
      query: req.query.query,
      apiKey: get_token(),
      number: 12,
      offset: req.query.offset
    }
  })
    .then(function (response) {
      return res.json(response.data)
    });
});

router.get('/', function (req, res, next) {
  res.redirect('/search')
});
router.get('/search', (req, res, next) => {
  res.render('search')
});
router.get('/information/:id', (req, res, next) => {
  let id = req.params.id
  let params = {
    apiKey: get_token(),
    id,
    includeNutrion: true
  }
  let url = `https://api.spoonacular.com/recipes/${id}/information`;
  axios.get(url, {
    params
  })
    .then(function (response) {
      response.data.summary = removeTags(response.data.summary);
      return res.render('view', {data: response.data})
    });
});

module.exports = router;
