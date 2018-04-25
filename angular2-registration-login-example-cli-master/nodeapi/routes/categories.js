var express = require('express');
var url = require('url');
var router = express.Router();
router.post("/api/categories/addCategory",function (req,res,next) {
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
                var insertSql = "INSERT INTO category SET ?";
                var insertValues = {
                    "parent_category_id" : reqObj.parent_category_id,
                    "category_name" : reqObj.category_name,
                    "category_description" : reqObj.category_description,
                    "category_image" : reqObj.category_image
                };
                var query = conn.query(insertSql, insertValues, function (err, result){
                    if(err){
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    res.status(200).send({
                        "code":"200",
                        "message":'A new category has been added.'});
                });
            }
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});
router.get('/api/categories/allCategories', function(req, res, next) {
    try {
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from category', function(err, rows) {
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
                        "message":"Categories are found.",
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
router.post('/api/products/updateCategoryById', function(req, res, next) {
    try {
        var query = url.parse(req.url,true).query;

        var category_id = query.category_id;
        var parent_category_id = query.parent_category_id;
        var category_name = query.category_name;
        var category_description = query.category_description;
        var category_image = query.category_image;
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {

                conn.query('UPDATE category SET category_name = ?,' +
                    ' parent_category_id = ?, category_description = ?, category_image = ?' +
                    '  WHERE product_id = ?',
                    [category_name,parent_category_id,category_description,category_image,category_id], function(err, result) {

                        if (err) {
                            console.error('SQL error: ', err);
                            return next(err);
                        }

                        res.status(200).send({
                            "code":"200",
                            "message":'A Category has been updated.'});

                    });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
router.delete("/api/categories/delete",function(req,res,next){
    try {
        var query = url.parse(req.url,true).query;
        var category_id = query.category_id;
        req.getConnection(function(err, conn){
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query("DELETE from category where category_id = ?",[category_id],function(err,result){
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }

                    res.status(200).send({
                        "code":"200",
                        "message":'A Category has been deleted.'});
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