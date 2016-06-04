
/********************************************************************************/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');

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
app.use(bodyParser.urlencoded({
    extended: true
})); // encoded body 지원

// 보안상 form method의 delete는 차단됨, 이를 허용함
// action='/myApp/id?_method=delete' 형태로 method overriding
app.use(methodOverride('_method'));

/********************************************************************************/

app.use(flash());
app.use(session({
    secret: 'MySecretKey'
}));
app.use(passport.initialize());
app.use(passport.session());

// session 생성시 저장할 정보
passport.serializeUser(function(user, done) {
    done(null, user.id); // db의 id
});
// session 취득
passport.deserializeUser(function(user, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Strategy은 로그인 방식
var LocalStrategy = require('passport-local').Strategy;
// strategy의 이름은 'local-my-login' 으로 정함
passport.use('local-my-login',
    // local strategy는 default로 user개체에서 'username'과 'password' 키를 찾아 읽습니다.
    // 아이디와 비밀번호를 나타내는 부분이 user 개체에서 다른 이름으로 저장되어 있다면
    // 이렇게 재설정을 해줘야 합니다.
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                'email': email
            }, function(err, resultSet) {
                if (err) {
                    return done(err);
                }
                if (!resultSet) {
                    req.flash('email', req.body.email);
                    return done(null, false, req.flash('loginError', 'No user found.'));
                }
                if (user.password != password) {
                    req.flash('email', req.body.email);
                    return done(null, false, req.flash('loginError', 'Password does not Match'));
                }

                // 인증을 통과하면 user 객체를 반환
                return done(null, resultSet);
            });
        }
    )
);

/********************************************************************************/

app.get('/login', function(req, res) {
    res.render('login/login', {
        email: req.flash('email')[0],
        loginError: req.flash('loginError')
    });
});
app.post('/login', function(req, res, next) {
    // flash는 한번 읽으면 값이 사라짐, 혹시 남아있을지 모르는 flash 값을 삭제함
    req.flash('email');
    if (req.body.email.length === 0 || req.body.password.length === 0) {
        req.flash('email', req.body.email);
        req.flash('loginError', 'Please enter both email and password.');
        req.redirect('/login');
    } else {
        next();
    }
}, passport.authenticate('local-my-login', {
    successRedirect: '/posts',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/logout', function(req, res) {
    req.logout(); // passport에서 지원
    res.redirect('/');
});


/********************************************************************************/



var v_data = {
    i_count: 0
};

// http://localhost:3000/p_count=50
app.get('/sample', function(req, res) {
    if (req.query.p_count) {
        v_data.i_count = req.query.p_count;
    } else {
        v_data.i_count++;
    }
    res.render('first_ejs', v_data);
});

// http://localhost:3000/sample/1000
app.get('/sample/:xxx', function(req, res) {
    v_data.i_count = req.params.xxx;
    res.render('first_ejs', v_data);
    //res.redirect('/sample');
});

// http://localhost:3000/sample_json
app.get('/sample_json', function(req, res) {
    res.json([
      {author: "Pete Hunt", text: "댓글입니다"},
      {author: "Jordan Walke", text: "*또 다른* 댓글입니다"}
    ]);
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

/********************************************************************************/

// model setting
var mySchema = mongoose.Schema({
    i_name: {
        type: String,
        required: true
    },
    i_count: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});
var MyData = mongoose.model('myTable', mySchema);

var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
var User = mongoose.model('userTable', userSchema);


/********************************************************************************/


// 없으면 새로 만든다.
MyData.findOne({
    i_name: 'hocha9938'
}, function(err, data) {
    if (err) {
        return console.log('Data ERROR : ', err);
    }
    if (!data) {
        var tempData = {
            i_name: 'hocha9938',
            i_count: 2,
            title: 'test',
            content: 'test'
        };
        MyData.create(tempData, function(err, data) {
            if (err) {
                console.log('Data ERROR : ', err);
            } else {
                console.log("Table initialized : ", data);
            }
        });
    }
});


/********************************************************************************/

// http://localhost:3000/my
app.get('/my', function(req, res) {
    MyData.find({}).sort('-createdAt').exec(function(err, resultSet) {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }
        //res.json({success:true, data:resultSet});
        res.render('first_ejs', {
            i_count: 0,
            v_data: resultSet
        });
    });
}); // list


// http://localhost:3000/my
// Content-Type: application/json
// {"xxx":{"i_name":"chacha","i_count":99,"title":"test2","content":"test2"}}
app.post('/my', function(req, res) {
    console.log(req.body);
    MyData.create(req.body.xxx, function(err, resultSet) {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }
        res.json({
            success: true,
            data: resultSet
        });
    });
}); // create



// http://localhost:3000/my/5749a5d234cfabbc128bbddc
app.get('/my/:id', function(req, res) {
    // {'_id':'5749a5d234cfabbc128bbddc'}
    MyData.findById(req.params.id, function(err, resultSet) {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }
        res.json({
            success: true,
            data: resultSet
        });
    });
}); // show


// http://localhost:3000/my/5749a5d234cfabbc128bbddc
// Content-Type: application/json
// {"xxx":{"i_name":"chacha","i_count":99,"title":"test2","content":"test2"}}
app.put('/my/:id', function(req, res) {
    req.body.xxx.updatedAt = Date.now();
    MyData.findByIdAndUpdate(req.params.id, req.body.xxx, function(err, resultSet) {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }
        res.json({
            success: true,
            data: resultSet._id + " updated"
        });
    });
}); // show


// http://localhost:3000/my/5749a5d234cfabbc128bbddc
app.delete('/my/:id', function(req, res) {
    MyData.findByIdAndRemove(req.params.id, function(err, resultSet) {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }
        res.json({
            success: true,
            data: req.params.id + " deleted"
        });
    });
}); // delete


/********************************************************************************/





/********************************************************************************/





/********************************************************************************/



/********************************************************************************/



app.listen(3000, function() {
    console.log('Server On!');
});
