var exrpress = require('express')
var MongoClient = require('mongodb').MongoClient;
var app = exrpress()

// mongoDB URL
var mongoURI = "mongodb://localhost:27017/";

// testing api
app.get('/',function(req,res){
res.send("<h1> API is working </h1>")
})

// trnasactiondetails api , sorted based on transaction_type in the following order of priority.
// 1. pending
// 2. success
// 3. failed
// 4. cancelled

app.get("/transactiondetails",(req,res) =>{
    MongoClient.connect(mongoURI, function(err, db) {
        if (err) throw err;
        // test is db name 
        var dbo = db.db("test");
        const pipeline = [
            {$addFields: {
                sortId: {
                    $cond: [
                        {$eq: ['$transaction_status','pending']},0,
                            {$cond: [
                                {$eq: ['$transaction_status','success']},1,
                                    {$cond:[
                                            {$eq:['$transaction_status','failed']},2,3
                                        ]
                                    }
                            ]
                        }
                    
                    ]
                }

            }},
           {$sort: {sortId: 1}}
         ];
        // transaction is collection which store trnsaction details
        dbo.collection("transaction").aggregate(pipeline).limit(100).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            res.send(result)
            db.close();
          });
      });
})
app.listen(3000,()=>{
    console.log("Server listing on port 3000")
})