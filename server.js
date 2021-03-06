const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const apiKey = 'fc54482ae38eb6a61271044e70103c75'

// Initiating the Express app
const app = express()

// Setting the view engine
app.set('view engine', 'ejs')
// Set port
app.set('port', process.env.PORT || 3000);
// Setting the public folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index', { title: 'Weather App', weather: null, error: null })
})

app.post('/', function (req, res) {
    let input = req.body.input
    let url
    if(isNaN(input)) {
        url = `http://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=${apiKey}`
    } else {
        url = `http://api.openweathermap.org/data/2.5/weather?zip=${input}&units=imperial&appid=${apiKey}`
    }
    request(url, function (err, response, body) {
        if (err) {
            res.render('index', { title: 'Weather App', weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body)
            if (weather.main == undefined) {
                res.render('index', { title: 'Weather App', weather: null, error: 'Error, please try again' })
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`
                res.render('index', { title: weather.name, weather: weatherText, error: null })
            }
        }
    })
})

app.listen(app.get('port'), function () {
    console.log(`Example app listening on port ${app.get('port')}!`)
})