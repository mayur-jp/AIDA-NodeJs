var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const { or } = require('ramda')
const fs = require('fs');
var path=require('path');

var app = express()
let obj = {
    valid_shipment_request_free_same_state_test: []
};

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.set('tests', path.join(__dirname, 'tests/requests'))

app.get('/', function(req, res) {
	//res.status(200).send({ status: 'OK' })

	res.sendFile(__dirname+"/views/page/"+'index.html');
})


app.get('/cost', function(req, res) {
 
	var costAmount=costCalculation(req);
	var empcode=req.body.code;
	var Name=req.body.empname;
	var city=req.body.city;
	var email=req.body.email;
	var dept=req.body.dept;

	 
	 fs.readFile(__dirname+"/tests/requests/"+'requests.json', function readFileCallback(err, data) {
			// let json = JSON.stringify(data);
			var json = JSON.parse(data)
			json.valid_shipment_request_free_same_state_test.push({
				"shipment_request": {
					"shippingAddress": {
					  "addressName": req.query.txtshippingadd,
					  "state": req.query.txtstate,
					  "name": req.query.name
					},
					"receivingAddress": {
					  "addressName": req.query.txtreceivingadd,
					  "state": req.query.txtRstate,
					  "name": "Jones"
					},
					"packages": [
					  {
						"name": req.query.txtproduct,
						"weight": req.query.txtweight,
						"unit": req.query.ddlunit
					  }
					]
				  },
				  "shipment": {
					"cost":costAmount 
				  }
			});
	
			fs.writeFile(__dirname+"/tests/requests/"+'requests.json', JSON.stringify(json), function(err) {
				if (err) throw err
				console.log('Done!')
			});
		});
		res.redirect('/');  
})

function costCalculation(req)
{
	console.log(req)
	let shipmentAmount=0;
	let TotalWeight=0;
	let CostAmount=0;

	// console.log('TotalWeight');
	// console.log(TotalWeight);

	if(req.query.txtstate!=req.query.txtRstate)
	{
		shipmentAmount=(req.query.txtshipment*20)/100;
	}
	if(req.query.txtunit="KG")
	{
		 TotalWeight=(req.query.txtweight*2.20462)
	}else
	{
		 TotalWeight=req.query.txtweight;
	}
	console.log('TotalWeight');
	console.log(TotalWeight);

	if(shipmentAmount>2 || shipmentAmount<21)
	{
		CostAmount=1*TotalWeight;
	}
	else if(shipmentAmount>20)
	{
		CostAmount=2*TotalWeight;
	}
	console.log('TotalWeight');
	console.log(CostAmount);
	return CostAmount;
}
module.exports = app;
