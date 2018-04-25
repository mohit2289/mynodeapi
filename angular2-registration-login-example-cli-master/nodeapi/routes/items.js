var express = require('express');
var router = express.Router();
var url = require('url');
module.exports = router;


router.post('/api/items/addItems', function(req,res,next){
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
                var insertSql = "INSERT INTO items SET ?";
               /* var insertValues = {
                    "item_name" : reqObj.item_name
                };*/
                var query = conn.query(insertSql, reqObj, function (err, result){
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
router.get('/api/items/allItems', function(req, res, next) {
    try {
		console.log('hello');
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from items', function(err, rows) {
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
                        "message":"items are found.",
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




