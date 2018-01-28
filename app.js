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
            console.log(date);
            var sign = req.body.result.parameters.sunsign.toLowerCase();
            getHoroscope(date, sign).then((response)=>{
                var data = JSON.parse(response)
                var output = "you're ${data.keywords} today. Also there is something you must note here:\n ${data.horoscope} \n ${data.mood} mood today. G'day mate :)";
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    }
    res.sendStatus(200)
})
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
//useful functions :
function getHoroscope(date,sign){
    //request
    return new Promise((resolve, reject)=>{
        var querydate ="";
        var todayDate = new Date()
        var tomorrowDate = new Date(new Date().getTime()+86400000);
        var tomorrow  = tomorrowDate.getFullYear()+ "-" + (tomorrowDate.getMonth()+1) + "-"+tomorrowDate.getDate();
        var today = todayDate.getFullYear()+ "-" + (todayDate.getMonth()+1) + "-"+ todayDate.getDate();
        if(date === today){
            querydate = "today"
        } 
        else{
            if(date === tomorrow){
                querydate = "tomorrow"
            }
            else{
                querydate = ""
            }
        }
        if(querydate !== ""){
            console.log(querydate);
            request({
                uri:"http://theastrologer-api.herokuapp.com/api/horoscope/"+sign+"/"+querydate,
                method : "GET",
                json:true
            },(err,res,body)=>{
                if(err) reject(err);
                if(res.body.error) {
                    reject(res.body.error)
                }
                else{
                    resolve(body);
                }
            });
        }
    })
}
function retrieveSign(date){
    var month = date.substring(5,7);
    var day = date.substring(8,10);
    function getZodiacSign(day, month) {
        var zodiacSigns = [
          'capricorn',
          'aquarius',
          'pisces',
          'aries',
          'taurus',
          'gemini',
          'cancer',
          'leo',
          'virgo',
          'libra',
          'scorpio',
          'sagittarius'
        ]
      
        if((month == 1 && day <= 20) || (month == 12 && day >=22)) {
          return zodiacSigns.capricorn;
        } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
          return zodiacSigns.aquarius;
        } else if((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
          return zodiacSigns.pisces;
        } else if((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
          return zodiacSigns.aries;
        } else if((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
          return zodiacSigns.taurus;
        } else if((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
          return zodiacSigns.gemini;
        } else if((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
          return zodiacSigns.cancer;
        } else if((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
          return zodiacSigns.leo;
        } else if((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
          return zodiacSigns.virgo;
        } else if((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
          return zodiacSigns.libra;
        } else if((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
          return zodiacSigns.scorpio;
        } else if((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
          return zodiacSigns.sagittarius;
        }
      } 
}
