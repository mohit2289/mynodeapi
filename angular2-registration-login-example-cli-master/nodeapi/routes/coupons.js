var express = require('express');
var url = require('url');
var router = express.Router();
router.post("/api/coupons/addCoupon",function (req,res,next) {
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
                var insertSql = "INSERT INTO coupons SET ?";
                var insertValues = {
                    "coupon_code" : reqObj.coupon_code,
                    "coupon_type" : reqObj.coupon_type,
                    "coupon_value" : reqObj.coupon_value,
                    "coupon_valid_from" : reqObj.coupon_valid_from,
                    "coupon_valid_to" : reqObj.coupon_valid_to,
                    "coupon_usage" : reqObj.coupon_usage,
                };
                var query = conn.query(insertSql, insertValues, function (err, result){
                    if(err){
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    res.status(200).send({
                        "code":"200",
                        "message":'A new coupon has been added.'});
                });
            }
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});
router.get('/api/coupons/allCoupons', function(req, res, next) {
    try {
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from coupons', function(err, rows) {
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
                        "message":"Coupons are found.",
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
router.post('/api/coupons/updateCouponById', function(req, res, next) {
    try {
        var query = url.parse(req.url,true).query;

        var coupon_id = query.coupon_id;
        var coupon_code = query.coupon_code;
        var coupon_type = query.coupon_type;
        var coupon_valid_from = query.coupon_valid_from;
        var coupon_valid_to = query.coupon_valid_to;
        var coupon_usage = query.coupon_usage;
        var coupon_value = query.coupon_value;
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {

                conn.query('UPDATE coupons SET coupon_code = ?,' +
                    ' coupon_type = ?, coupon_value = ?, coupon_usage = ?, coupon_valid_from = ?,' +
                    ' coupon_valid_to = ? WHERE coupon_id = ?',
                    [coupon_code,coupon_type,coupon_value,coupon_usage,coupon_valid_from,coupon_valid_to,coupon_id], function(err, result) {
                    
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }

                    res.status(200).send({
                        "code":"200",
                        "message":'A Coupon has been updated.'});

                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
router.delete("/api/coupons/delete",function(req,res,next){
    try {
        var query = url.parse(req.url,true).query;
        var coupon_id = query.coupon_id;
        req.getConnection(function(err, conn){
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query("DELETE from coupons where coupon_id = ?",[coupon_id],function(err,result){
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }

                    res.status(200).send({
                        "code":"200",
                        "message":'A Coupon has been deleted.'});
                })
            }
        });
    }
    catch (ex){
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
module.exports = router;