
/********************************************************************************/

var express = require('express');
var path = require('path');
var app = express();

/********************************************************************************/

app.set('view engine', 'ejs'); // express는 디폴트 views 폴더안의 ejs를 등록한다.

/********************************************************************************/

// app.use 는 filter와 같은 역할을 한다.

// index 지정
// app.get('/',function(req,res) {
//   res.send('Hello World!');
// });
app.use(express.static(path.join(__dirname, 'public')));

/********************************************************************************/
var v_data = {i_count:0};

// http://localhost:3000/p_count=50
app.get('/sample',function(req,res) {
  if(req.query.p_count) {
    v_data.i_count = req.query.p_count;
  } else {
    v_data.i_count++;
  }
  res.render('first_ejs', v_data);
});

// http://localhost:3000/sample/1000
app.get('/sample/:xxx',function(req,res) {
  v_data.i_count = req.params.xxx;
  res.render('first_ejs', v_data);
});

/********************************************************************************/

var mongoose = require('mongoose');
mongoose.connect('mongodb://hocha9938:hocha9938@ds015953.mlab.com:15953/sample');
var db = mongoose.connection;
db.once('open', function() {
  console.log('DB connected!');
});
db.on('error', function() {
  console.log('DB ERROR : ', err);
});

// Collection : Table
// Document : Row, Array

var mySchema = mongoose.Schema({
  name:String,
  count:Number
});
 
var MyData = mongoose.model('myTable', mySchema);

// 없으면 새로 만든다.
MyData.findOne({name:'hocha9938'}, function(err, data) {
  if(err) { return console.log('Data ERROR : ', err); }
  if(!data) {
    MyData.create({name:'hocha9938',count:2}, function(err, data) {
      console.log("Table initialized : ", data);
    });
  }
});



/********************************************************************************/



app.listen(3000,function() {
  console.log('Server On!');
});

/********************************************************************************/
