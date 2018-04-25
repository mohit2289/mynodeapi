var express = require('express');
var router = express.Router();
var url = require('url');
var jwt = require('jsonwebtoken');
module.exports = router;
function verifyToken(req,res,next)
{
    const bearerHeader = req.header['Authorization'];
    if(typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token  = bearerToken;
        next();
    }else {
        res.status(403);
    }
}
router.post('/api/auth/verifyToken',verifyToken,function(req,res){
    jwt.verify(req.token,'secretkey',function(err,authData){
        if (err) {
            console.error('Token verify error: ', err);
            return next(err);
        }
        res.status(200).send({
            "code":200,
            "message":'User Authenticated',
            "data":authData
        });
    })
});
router.post('/api/auth/login',function(req,res,next){
    var query = url.parse(req.url,true).query;
    var reg_username = query.username;
    var reg_password = query.password;
    req.getConnection(function(err,conn){
        if (err) {
            console.error('SQL Connection error: ', err);
            return next(err);
        }
        else{conn.query("select * from users where username = ? and password = ?",[reg_username,reg_password],function(err,result){
            if (err) {
                console.error('SQL error: ', err);
                return next(err);
            }
			
            jwt.sign({'authenticatedUser':result},'secretkey',function(err,token){
                res.json({
                  token:token					
                });
            });

        });
        }
    });
});


router.post("/api/auth/regist",function (req,res,next) { 
    try{
        var reqObj = req.body;
        req.getConnection(function(err, conn){
            if(err)
            {
                console.error('SQL Connection error: ', err);
                return next(err);
            }
            else
            {
                var insertSql = "INSERT INTO users SET ?";
                var insertValues = {
                       "first_name" : reqObj.firstName,
						"last_name" : reqObj.lastName,
						 "username" : reqObj.username,
						 "password" : reqObj.password
                };
                var query = conn.query(insertSql, insertValues, function (err, result){
                    if(err){
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    res.status(200).send({
                        "code":"200",
                        "message":'A new user has been added.'});
                });
            }
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

