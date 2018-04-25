var express = require('express');
var router = express.Router();
var url = require('url');
module.exports = router;


router.post('/api/roles/addRole', function(req,res,next){
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
                var insertSql = "INSERT INTO roles SET ?";
                var insertValues = {
                    "role_name" : reqObj.role_name
                };
                var query = conn.query(insertSql, insertValues, function (err, result){
                    if(err){
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    res.status(200).send({
                        "code":"200",
                        "message":'A new role has been added.'});
                });
            }
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

/* Get Role Service. */
router.get('/api/roles/allRoles', function(req, res, next) {
    try {
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from roles', function(err, rows) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var data = [];
                    for (var index in rows) {
                        var rowObj = rows[index];
                        data.push(rowObj);
                    }
                    res.status(200).send({
                        "code":200,
                        "message":"Roles are found.",
                        "data":data
                    });
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


router.put('/api/roles/updateRoleById', function(req, res, next) {
    try {
        var query = url.parse(req.url,true).query;

        var role_id = query.role_id;
        var role_name = query.role_name;
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('UPDATE roles SET role_name = ? WHERE role_id = ? order by timestamp', [role_name,role_id], function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }

                    res.status(200).send({
                        "code":"200",
                        "message":'A Role has been updated.'});

                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

router.delete("/api/roles/delete",function(req,res,next){
    try {
        var query = url.parse(req.url,true).query;
        var role_id = query.role_id;
        req.getConnection(function(err, conn){
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query("DELETE from roles where role_id = ?",[role_id],function(err,result){
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }

                    res.status(200).send({
                        "code":"200",
                        "message":'A Role has been deleted.'});
                })
            }
        });
    }
    catch (ex){
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
