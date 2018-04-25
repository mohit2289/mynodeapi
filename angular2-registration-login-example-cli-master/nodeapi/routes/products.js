var express = require('express');
var url = require('url');
var router = express.Router();
router.post("/api/products/addProduct",function (req,res,next) {
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
                var insertSql = "INSERT INTO product SET ?";
                var insertValues = {
                    "product_name" : reqObj.product_name,
                    "product_price" : reqObj.product_price,
                    "category_id" : reqObj.category_id,
                    "product_image" : reqObj.product_image
                };
                var query = conn.query(insertSql, insertValues, function (err, result){
                    if(err){
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    res.status(200).send({
                        "code":"200",
                        "message":'A new product has been added.'});
                });
            }
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});
router.get('/api/products/allProducts', function(req, res, next) {
    try {
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from product', function(err, rows) {
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
                        "message":"Products are found.",
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
router.post('/api/products/updateProductById', function(req, res, next) {
    try {
        var query = url.parse(req.url,true).query;

        var product_id = query.product_id;
        var product_name = query.product_name;
        var category_id = query.category_id;
        var product_price = query.product_price;
        var product_image = query.product_image;
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {

                conn.query('UPDATE product SET product_name = ?,' +
                    ' category_id = ?, product_price = ?, product_image = ?' +
                    '  WHERE product_id = ?',
                    [product_id,category_id,product_price,product_image,product_id], function(err, result) {

                        if (err) {
                            console.error('SQL error: ', err);
                            return next(err);
                        }

                        res.status(200).send({
                            "code":"200",
                            "message":'A Product has been updated.'});

                    });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
router.delete("/api/products/delete",function(req,res,next){
    try {
        var query = url.parse(req.url,true).query;
        var product_id = query.product_id;
        req.getConnection(function(err, conn){
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query("DELETE from product where product_id = ?",[product_id],function(err,result){
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }

                    res.status(200).send({
                        "code":"200",
                        "message":'A Product has been deleted.'});
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