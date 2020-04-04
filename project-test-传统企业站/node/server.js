var express = require('express');//node的一个框架
var bodyParser = require('body-parser');//express的插件，数据整理
var http = require('http');//http对象，node内置对象
var path = require('path');//路径对象，node内置对象
var fs = require('fs');//文件对象; node内置对象
var mysql = require('mysql');//引入mysql
var moment = require('moment');//修改时间格式
var multipart = require('connect-multiparty');//文件上传的插件
var app = express();
//建立静态资源访问
app.use(express.static(path.join(__dirname,'src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var pool = mysql.createPool({//建立连接池对象
  host: 'localhost',
  user: 'root',
  password: 'yujian2010',
  port: 3306,
  database: 'qyz'
});
var hostname = 'http://localhost:8089';
function mysqlQuery(sql,callback){
  pool.getConnection((err,connection)=>{
    if(err){
      console.log(`数据库错误：${err}`);
    }
    else{
      connection.query(sql,(err,result)=>{
        connection.release();//释放连接
        if(typeof callback == 'function'){
          callback(result,err);
        }
      });
    }
  });
}
//行业资讯
app.post('/post/news/add',(req,res) =>{
  var title = req.body.title;
  var content = req.body.content;
  //console.log(title,content)
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  mysqlQuery(`insert into qyz_news (title,content,createDate) value ("${title.replace(/\"/g,"\\\"")}","${content.replace(/\"/g,"\\\"")}","${createDate}")`,(result)=>{
    //console.log(result)
    if(result){
      res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
    }
  });
});
app.delete('/delete/news',(req,res) =>{
  var id = req.query.id;
  mysqlQuery(`delete from qyz_news where id=${id}`,(result)=>{
    //console.log(result);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
    }
  })
});
app.put('/put/news',(req,res) =>{
  var id = req.body.id;
  var title = req.body.title;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  console.log(title,content,createDate)
  mysqlQuery(`update qyz_news set title="${title.replace(/\"/g,"\\\"")}",content="${content.replace(/\"/g,"\\\"")}",createDate="${createDate}" where id=${id}`,(result,err)=>{
    console.log(result,err);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
    }
  })
});
var multipartMiddleware = multipart();//上传接口
app.put('/put/news/img',multipartMiddleware,(req,res) =>{
  var id = req.body.id;
  var frontPath = req.files.file.path; //前端文件的地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath, function (err, data) {
      if (err){
        res.json({ code: -1, msg: 'failed', data: false });
        return;
      };
      //console.log('File read!');
      // Write the file-写入后台的地址
      fs.writeFile(newPath, data, function (err) {//data是buffer缓冲区二进制数据
          if (err){
            res.json({ code: -1, msg: 'failed', data: false });
          }
          else{
            mysqlQuery(`update qyz_news set imgUrl="${'/upload/'+req.files.file.originalFilename}" where id=${id}`,(result,err)=>{
              console.log(result,err);
              if(result){
                res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
              }
              else{
                res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
              }
            });
          }
      });
      // Delete the file临时文件地址
      fs.unlink(frontPath, function (err) {
          if (err) throw err;
          //console.log('File deleted!');
      });
  });
});
app.get('/get/news',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  //select * from 表名 limit 跳过的数据,取几条
  mysqlQuery(`select * from qyz_news limit ${(page-1)*10}, 10`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          title: item.title,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl
        }
      });

      mysqlQuery(`select id from qyz_news`,(idArr)=>{
        if(idArr){
          var total = idArr.length
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页是1,
            pageNum: 10,//每页是10个
            data,
          });
        }
        else{
          res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
        }
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
    }
  });
});
app.get('/get/news/detail',function(require,response){
  //console.log(typeof require.query,require.query);
  var id = require.query.id;
  mysqlQuery(`select * from qyz_news where id=${id}`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          title: item.title,
          createDate: item.createDate.getTime(),
          content: item.content,
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl
        }
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: null });//给前端响应信息
    }
  });
});
//产品列表
app.post('/post/product/add',(req,res) =>{
  var title = req.body.title;
  var content = req.body.content;
  //console.log(title,content)
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  mysqlQuery(`insert into qyz_product (title,content,createDate) value ("${title.replace(/\"/g,"\\\"")}","${content.replace(/\"/g,"\\\"")}","${createDate}")`,(result)=>{
    //console.log(result)
    if(result){
      res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
    }
  });
});
app.delete('/delete/product',(req,res) =>{
  var id = req.query.id;
  mysqlQuery(`delete from qyz_product where id=${id}`,(result)=>{
    //console.log(result);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
    }
  })
});
app.put('/put/product',(req,res) =>{
  var id = req.body.id;
  var title = req.body.title;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  console.log(title,content,createDate)
  mysqlQuery(`update qyz_product set title="${title.replace(/\"/g,"\\\"")}",content="${content.replace(/\"/g,"\\\"")}",createDate="${createDate}" where id=${id}`,(result,err)=>{
    console.log(result,err);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
    }
  })
});
app.put('/put/product/img',multipartMiddleware,(req,res) =>{
  var id = req.body.id;
  var frontPath = req.files.file.path; //前端文件的地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath, function (err, data) {
      if (err){
        res.json({ code: -1, msg: 'failed', data: false });
        return;
      };
      //console.log('File read!');
      // Write the file-写入后台的地址
      fs.writeFile(newPath, data, function (err) {//data是buffer缓冲区二进制数据
          if (err){
            res.json({ code: -1, msg: 'failed', data: false });
          }
          else{
            mysqlQuery(`update qyz_product set imgUrl="${'/upload/'+req.files.file.originalFilename}" where id=${id}`,(result,err)=>{
              console.log(result,err);
              if(result){
                res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
              }
              else{
                res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
              }
            });
          }
      });
      // Delete the file临时文件地址
      fs.unlink(frontPath, function (err) {
          if (err) throw err;
          //console.log('File deleted!');
      });
  });
});
app.get('/get/product',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  //select * from 表名 limit 跳过的数据,取几条
  mysqlQuery(`select * from qyz_product limit ${(page-1)*10}, 10`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl
        }
      });
      mysqlQuery(`select id from qyz_product`,(idArr)=>{
        if(idArr){
          var total = idArr.length
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页是1,
            pageNum: 10,//每页是10个
            data,
          });
        }
        else{
          res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
        }
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
    }
  });
});
app.get('/get/product/detail',function(require,response){
  //console.log(typeof require.query,require.query);
  var id = require.query.id;
  mysqlQuery(`select * from qyz_product where id=${id}`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          title: item.title,
          createDate: item.createDate.getTime(),
          content: item.content,
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl
        }
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: null });//给前端响应信息
    }
  });
});
//联系我们
app.get('/get/contact',function(require,response){
  //console.log(typeof require.query,require.query);
  mysqlQuery(`select * from qyz_contact where id=1`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          address: item.address,
          officeTel: item.officeTel,
          contactTel: item.contactTel,
          postcode: item.postcode,
          email: item.email,
          imgUrl: hostname+item.imgUrl,
        };
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: {} });//给前端响应信息
    }
  });
});
app.put('/put/contact',multipartMiddleware,(req,res) =>{
  console.log(req.body)
  var address = req.body.address;
  var officeTel = req.body.officeTel;
  var contactTel = req.body.contactTel;
  var postcode = req.body.postcode;
  var email = req.body.email;
  var frontPath = req.files.file.path; //后端拿到的文件临时地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath, function (err, data) {
      if (err){
        res.json({ code: -1, msg: 'failed', data: false });
        return;
      };
      //console.log('File read!');
      // Write the file-写入后台的地址
      fs.writeFile(newPath, data, function (err) {//data是buffer缓冲区二进制数据
          if (err){
            res.json({ code: -1, msg: 'failed', data: false });
          }
          else{
            mysqlQuery(`update qyz_contact set imgUrl="${'/upload/'+req.files.file.originalFilename}",address="${address}",officeTel="${officeTel}",contactTel="${contactTel}",postcode="${postcode}",email="${email}" where id=1`,(result,err)=>{
              console.log(result,err);
              if(result){
                res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
              }
              else{
                res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
              }
            });
          }
      });
      // Delete the file临时文件地址
      fs.unlink(frontPath, function (err) {
          if (err) throw err;
          //console.log('File deleted!');
      });
  });
});
//主页
app.get('/get/index/us',function(require,response){
  //console.log(typeof require.query,require.query);
  mysqlQuery(`select * from qyz_index_us where id=1`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          introduce: item.introduce,
          imgUrl: hostname+item.imgUrl,
        };
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: {} });//给前端响应信息
    }
  });
});
app.put('/put/index/us',multipartMiddleware,(req,res) =>{
  console.log(req.body)
  var introduce = req.body.introduce;
  var frontPath = req.files.file.path; //后端拿到的文件临时地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath, function (err, data) {
      if (err){
        res.json({ code: -1, msg: 'failed', data: false });
        return;
      };
      //console.log('File read!');
      // Write the file-写入后台的地址
      fs.writeFile(newPath, data, function (err) {//data是buffer缓冲区二进制数据
          if (err){
            res.json({ code: -1, msg: 'failed', data: false });
          }
          else{
            mysqlQuery(`update qyz_index_us set imgUrl="${'/upload/'+req.files.file.originalFilename}",introduce="${introduce}" where id=1`,(result,err)=>{
              console.log(result,err);
              if(result){
                res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
              }
              else{
                res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
              }
            });
          }
      });
      // Delete the file临时文件地址
      fs.unlink(frontPath, function (err) {
          if (err) throw err;
          //console.log('File deleted!');
      });
  });
});
app.get('/get/index/news_img',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  //select * from 表名 limit 跳过的数据,取几条
  mysqlQuery(`select * from qyz_news limit 0,3`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl
        }
      });
      mysqlQuery(`select id from qyz_news`,(idArr)=>{
        if(idArr){
          var total = idArr.length
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页是1,
            pageNum: 10,//每页是10个
            data,
          });
        }
        else{
          res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
        }
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
    }
  });
});

app.get('/get/index/products',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  //select * from 表名 limit 跳过的数据,取几条
  mysqlQuery(`select * from qyz_product limit 0,6`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          title: item.title,
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl
        }
      });
      mysqlQuery(`select id from qyz_product`,(idArr)=>{
        if(idArr){
          var total = idArr.length
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页是1,
            pageNum: 10,//每页是10个
            data,
          });
        }
        else{
          res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
        }
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
    }
  });
});

app.get('/get/index/news',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  //select * from 表名 limit 跳过的数据,取几条
  mysqlQuery(`select * from qyz_news limit 0,6`,(result)=>{
    if(result){
      var data = result.map(item => { 
        return {
          id: item.id,
          title: item.title
        }
      });
      mysqlQuery(`select id from qyz_news`,(idArr)=>{
        if(idArr){
          var total = idArr.length
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页是1,
            pageNum: 10,//每页是10个
            data,
          });
        }
        else{
          res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
        }
      });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: [] });//给前端响应信息
    }
  });
});
//
http.createServer(app).listen(8089,function(){
  console.log('8089启动成功');
});