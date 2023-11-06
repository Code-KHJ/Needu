const express = require('express');
const nunjucks = require('nunjucks');
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { auth } = require('./routes/middleware/auth');
const indexRouter = require('./routes/index');
const { logout } = require('./routes/controllers/user.js');
const swaggerUi = require('swagger-ui-express');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/admin/front'));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.set('view engine', 'html');
nunjucks.configure(['./public', './admin/front'], {
  autoescape: true,
  watch: true,
  express: app,
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(require('./swagger/swagger'))
);

app.use('/', require('./routes/index'));

app.get('/logout', auth, logout);
app.use('/mypage', require('./routes/mypage'));
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/review', require('./routes/review'));
app.use('/review/write', require('./routes/review_write'));
app.use('/chat', require('./routes/chat'));

app.use('/admin', require('./admin/back/admin.routes'));
// app.get("/404", auth, (req, res)=>{
//     res.render('404.html', {User: req.user})
// })

app.use((req, res, next) => {
  res.status(404).render('404.html');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500.html');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
