/**
 * SETUP
 */

var express = require('express'), // Express Server framework
    app = express(), // We need to initialize our server
    bodyParser = require('body-parser'), // Parsing middleware for BODY of the request
    // https://www.npmjs.com/package/body-parser
    mongoose = require('mongoose');

// Support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Support json encoded bodies
app.use(bodyParser.json());

/**
 * Instead of using our fake globar array/db we are now calling mongoose npm and allowing it to connect to database
 * https://cloud.mongodb.com/
 */
mongoose.connect("mongodb+srv://webdevredeption:webdevredeption@webdevredeption-l9eno.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

/**
 * This is basic function to create schema/table/array of objects inside your database
 * 
 * More info and how to include Database validation of intputs is available at
 * https://mongoosejs.com/docs/guide.html
 */

const eventSchema = new mongoose.Schema({
    Title: String,
    Date: Date,
    Place: String,
    Category: String,
    Priority: Number
})

/**
 * Here we are "assigning" our table to variable Bandit which 
 * will allow us to manipulate with Bandits inside database
 */

const Event = mongoose.model("Event", eventSchema);


/*
* Config server bodies and headers
*/

/**
 * When you create your server, sometimes you will get CORS errors
 * 
 * This headers will tell our server :
 * 
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*"); // Allow anyone to send requests to our app
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, PATCH, DELETE"); // Only allow next verbs/methods
    res.header(
        "Access-Control-Allow-Headers", // Allowing headers
        "Origin, X-Requested-With, Content-Type, X-HTTP-Method-Override," +
        " Accept, Authorization, delivery-platform"
    );
    next();
});
    

app.listen(3500, function () {
    // When servers start, console us a message
    console.log(`Server is listening port 3500`);
});


app.post("/add", function (req, res) {
   /**
    * If you send POST request to http:localhost:3500/add
    * 
    * With body { name: Buffalo, bounty: 20000, currency: USD }
    * We will create a new bandit in database
    */

    const { body: data } = req;

    console.log(data);
    const newBandit = {
        name: data.name,
        bounty: data.bounty,
        currency: data.currency,
        claimed: false
    }
    Bandit.create(newBandit, function (err, created) {
        if (err) return handleError(err);
        res.send(created);
    });
});

app.get("/bandit", function(req,res){
   
    /**
    * If you send GET request to http:localhost:3500/bandit
    * 
    * API will return all all bandits
    * In this function you can add query params in url 
    * And create search by name, currency, bounty ... 
    * 
    * https://mongoosejs.com/docs/queries.html
    * 
    * Scroll down for example
    */

    Bandit.find({}, function(err,bandits){ 
        if(err){
            res.send("NOT WORKING");
        }
        res.send(bandits)
    
    });

});

app.get("/search", function(req,res){

    const {query} = req;
    let searchObject = {};
    if(query.name){
     searchObject = Object.assign({}, {
         name: query.name
     });
    }

    /**
     * In this example you can see when we are using to search inside
     * our database we are using function Bandit.find(searchObject, callbackfunction [function to be executed after FIND finish])
     * 
     * 
     */
    Bandit.find(searchObject, function(err,bandits){ 
        if(err){
            res.send("NOT WORKING");
        }

        /**
         * Here you can add more logic 
         */

        res.send(bandits)
    

    });

    /**
     * Anything under this line will be executed even we have res.sed inside callbackfunction in FIND
     * So it's usually empty 
     */
});

app.get("/searchAsync",async (req,res) => {

    /**
     * There is another way to use FIND function with using async/await 
     * 
     * When we have const bandits = Bandit.find(searchObj) we would get promise
     * With await function we said to code, STOP, execute FIND, give me data and I will do the rest..
     * 
     * When you are working with async/await you should have try{}catch{} block
     * 
     * https://dev.to/_ferh97/understanding-callbacks-and-promises-3fd5
     * 
     * There are a lot of tutorials     
     * https://dev.to/siwalikm/async-programming-basics-every-js-developer-should-know-in-2018-a9c
     * https://dev.to/lampewebdev/i-promise-this-is-a-practical-guide-to-async--await-39ek
     * https://dev.to/_ferh97/understanding-callbacks-and-promises-3fd5
     * 
     */
    
    const {query} = req;
    let searchObject = {};
    if(query.name){
        searchObject = Object.assign({}, {
            name: query.name
        });
    }

    try {
        const bandits = await Bandit.find(searchObject);
        res.send({data : bandits});
    } catch (error) {
        console.log(error);
        res.send({data: []});
    }
});



app.put("/bandit/:id", function(req,res){
    /**
    * If you send PUT request to http:localhost:3500/bandit/idOfBanditFromDB
    * 
    * API will update that specific bandit by ID
    * Inside the body we send all required data 
    * 
    * https://mongoosejs.com/docs/queries.html
    * 
    */
    console.log(req.params.id);
    Bandit.findOneAndUpdate(req.params.id, req.body, function(err, updated){
        if(err){
            console.log(err);
            res.send(err);
            return;
        } 

        console.log(updated);
        res.send(updated);

    });
});