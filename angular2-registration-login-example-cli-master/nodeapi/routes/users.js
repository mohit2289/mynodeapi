var express = require('express');
var router = express.Router();
var url = require('url');
module.exports = router;


/* Get ALL USERS. */
router.get('/api/users', function(req, res, next) {
    try {
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from users', function(err, rows) {
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
                        "message":"User are found.",
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
