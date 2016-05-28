
/********************************************************************************/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); // encoded body 지원

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
  i_name:{type:String, required:true},
  i_count:{type:Number, required:true},
  title:{type:String, required:true},
  content:{type:String, required:true},
  createdAt:{type:Date, default:Date.now},
  updatedAt:Date
});

var MyData = mongoose.model('myTable', mySchema);

// 없으면 새로 만든다.
MyData.findOne({i_name:'hocha9938'}, function(err, data) {
  if(err) { return console.log('Data ERROR : ', err); }
  if(!data) {
    var tempData = {i_name:'hocha9938',i_count:2,title:'test',content:'test'};
    MyData.create(tempData, function(err, data) {
      if(err) {
        console.log('Data ERROR : ', err);
      } else {
        console.log("Table initialized : ", data);
      }
    });
  }
});



/********************************************************************************/

// http://localhost:3000/my
app.get('/my',function(req,res) {
  MyData.find({}, function(err, resultSet) {
    if(err) { return res.json({success:false, message:err}); }
    res.json({success:true, data:resultSet});
  });
}); // list


// http://localhost:3000/my
// Content-Type: application/json
// {"xxx":{"i_name":"chacha","i_count":99,"title":"test2","content":"test2"}}
app.post('/my',function(req,res) {
  console.log(req.body);
  MyData.create(req.body.xxx, function(err, resultSet) {
    if(err) { return res.json({success:false, message:err}); }
    res.json({success:true, data:resultSet});
  });
}); // create



// http://localhost:3000/my/5749a5d234cfabbc128bbddc
app.get('/my/:id',function(req,res) {
  // {'_id':'5749a5d234cfabbc128bbddc'}
  MyData.findById(req.params.id, function(err, resultSet) {
    if(err) { return res.json({success:false, message:err}); }
    res.json({success:true, data:resultSet});
  });
}); // show


// http://localhost:3000/my/5749a5d234cfabbc128bbddc
// Content-Type: application/json
// {"xxx":{"i_name":"chacha","i_count":99,"title":"test2","content":"test2"}}
app.put('/my/:id',function(req,res) {
  req.body.xxx.updatedAt = Date.now();
  MyData.findByIdAndUpdate(req.params.id, req.body.xxx, function(err, resultSet) {
    if(err) { return res.json({success:false, message:err}); }
    res.json({success:true, data:resultSet._id + " updated"});
  });
}); // show


// http://localhost:3000/my/5749a5d234cfabbc128bbddc
app.delete('/my/:id',function(req,res) {
  MyData.findByIdAndRemove(req.params.id, function(err, resultSet) {
    if(err) { return res.json({success:false, message:err}); }
    res.json({success:true, data:req.params.id + " deleted"});
  });
}); // delete


/********************************************************************************/





/********************************************************************************/





/********************************************************************************/



/********************************************************************************/



app.listen(3000,function() {
  console.log('Server On!');
});

/********************************************************************************/
