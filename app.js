//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");  // setting up mailchimp api

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/contact.html", function(req,res){
  res.sendFile(__dirname + "/contact.html");
});

//When you want to console log all the sign up detils locally in oyur terminal
// app.post("/contact.html", function(req,res){
//   var firstname = req.body.fname;
//   var lastname = req.body.lname;
//   var email = req.body.mail;
//
//   console.log(firstname, lastname, email);
// });

app.post("/contact.html", function(req,res){
  var firstname = req.body.fname;
  var lastname = req.body.lname;
  var email = req.body.mail;

  const data = {
    members : [                //array of objects
      {
        email_address: email,        //string
        status: "subscribed",        //string
        merge_fields: {              //object
          FNAME: firstname,          //string
          LNAME: lastname            //string
        }
      }
    ]
  };

  //convert the data to flatpack json
  const jsonData = JSON.stringify(data);

//const url = "https:usX.api.mailchimp.com/3.0/lists/9331cf6a80";          //main mailchimp endpoint
//we will replace the 'X' above with the no. at the end of api key as mailchimp has no.of servers running simultaneously so we need to specify one
const url = "https:us10.api.mailchimp.com/3.0/lists/9331cf6a80";
const options = {
  method: "POST",
  auth: "TindogM:85a3967eaedc1d6b80d8804e75c888fe-us10"
};

const request = https.request(url, options, function(response){         // can refer to node.js org for details

  if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

request.write(jsonData);
request.end();

});

app.post("/failure.html",function(req,res){
   res.redirect("/contact.html");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running at port 3000.");
});

//API key    85a3967eaedc1d6b80d8804e75c888fe-us10
//List ID    9331cf6a80
