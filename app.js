const app = require("express")();
const bodyParser = require("body-parser");
const request = require("request")
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json());
//endpoint
app.post("/webhook", (req,res)=>{
    var action = req.body.result.action;
    if(action =="input.asking_for_horoscope"){
        if(req.body.result.actionIncomplete == false){
            var date = req.body.result.parameters.date;
            getHoroscope(date);
        }
       
    }
    res.sendStatus(200)
})
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
//useful functions :
function getHoroscope(date){
    request({
        uri:"http://theastrologer-api.herokuapp.com/api",
        method : "GET",
        json:true
    },(err,res,body)=>{
        if(err) console.log(err);
        if(res.body.err) console.log(res.body.err);
        console.log(body);
    });
}