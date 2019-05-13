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
mongoose.connect("mongodb+srv://admin:admin1234@ahenda-vsdmo.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

/**
 * This is basic function to create schema/table/array of objects inside your database
 * 
 * More info and how to include Database validation of intputs is available at
 * https://mongoosejs.com/docs/guide.html
 */

const eventSchema = new mongoose.Schema({
    Title: String,
    Date: String,
    Place: String,
    Category: String,
    Priority: Number,
    Description: String
})

/**
 * Here we are "assigning" our table to variable Event which 
 * will allow us to manipulate with Events inside database
 */

const Event = mongoose.model("Event3", eventSchema);


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
    * We will create a new event in database
    */

    const { body: data } = req;

    console.log(data);
    const newEvent = {
        Title: data.title,
        Date: data.date,
        Place: data.place,
        Category: data.category,
        Priority: data.priority,
        Description: data.description
    }
    Event.create(newEvent, function (err, created) {
        if (err) return handleError(err);
        res.send(created);
        
    });
});

app.get("/", function(req,res){
   
    /**
    * If you send GET request to http:localhost:3500
    * 
    * API will return all all events
    * In this function you can add query params in url 
    * And create search by name, currency, bounty ... 
    * 
    * https://mongoosejs.com/docs/queries.html
    * 
    * Scroll down for example
    */

    Event.find({}, function(err,events){ 
        if(err){
            res.send("NOT WORKING");
        }
        res.send(events)
    
    });

});

// app.get("/search", function(req,res){

//     const {query} = req;
//     let searchObject = {};
//     if(query.title){
//      searchObject = Object.assign({}, {
//          title: query.title
//      });
//     }

//     /**
//      * In this example you can see when we are using to search inside
//      * our database we are using function Event.find(searchObject, callbackfunction [function to be executed after FIND finish])
//      * 
//      * 
//      */
//     Event.find(searchObject, function(err,events){ 
//         if(err){
//             res.send("NOT WORKING");
//         }

//         /**
//          * Here you can add more logic 
//          */

//         res.send(events)
    

//     });

//     /**
//      * Anything under this line will be executed even we have res.sed inside callbackfunction in FIND
//      * So it's usually empty 
//      */
// });

app.get("/search",async (req,res) => {

    /**
     * There is another way to use FIND function with using async/await 
     * 
     * When we have const events = Event.find(searchObj) we would get promise
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
    if(query.title){
        searchObject = Object.assign({}, {
            title: query.title
        });
    }

    try {
        const events = await Event.find(searchObject);
        res.send({data : events});
    } catch (error) {
        console.log(error);
        res.send({data: []});
    }
});



app.put("/event/:id", function(req,res){
    /**
    * If you send PUT request to http:localhost:3500/event/idOfEventFromDB
    * 
    * API will update that specific event by ID
    * Inside the body we send all required data 
    * 
    * https://mongoosejs.com/docs/queries.html
    * 
    */
    console.log(req.params.id);
    console.log(req.body);
    Event.findOneAndUpdate(req.params.id, req.body, function(err, updated){
        if(err){
            console.log(err);
            res.send(err);
            return;
        } 

        console.log(updated);
        res.send(updated);

    });
});