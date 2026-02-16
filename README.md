# Auction-Platform

frontend (client)
i initialize by writing npm create vite@latest then selected react as framework,variant=javascript


backend(server)
create .env to store port no
npm init -y (to initialize) then creates package.json
now time to install express,moongose,dotenv,cors

| Package  | Purpose                        |
| -------- | ------------------------------ |
| express  | Server & APIs                  |
| mongoose | Talk to MongoDB                |
| dotenv   | Read `.env` file               |
| cors     | Allow frontend to call backend |

npm install --save-dev nodemon
Purpose:
Auto-restart server on changes
Later you’ll add a script for it.


package.json contains descriptive & functional metadata about project such as name,version & dependencies.
port -> logical endpoints of a network connection that is used to exchange information between a web server & web client.(interchanging data b/w server & client)
routing->it is process of selecting a path for traffic in a network.

mongoose.model()->it converts a schema into a usable model that can talk to mongodb.
ObjectId->it is mongodb's unique identifier for each document.
ref tells mongoose which collection this objectid belongs to.

transaction records-> stores every action separate instead of updating one document repeatedly.

express routers->groups related api endpoints together.
A controller handles request → logic → response.

A controller function is just a normal javascript function that express calls when an api endpoint is hit.
req->incoming request, res->response you send back

{createAuction}-> this means exporting as object.

Browser URL bar → GET
Creating data → POST

Postman is a tool to send HTTP requests manually to backend APIs.
Why we use it:
Browser only sends GET
Backend needs POST, PUT, DELETE
Industry-standard testing tool

When a POST request comes to:

POST /api/auctions

Backend should:
Read data from request body
Create a new Auction document
Save it in MongoDB
Return saved auction as response

req.body-> contains data sent by client in post request

index.js (Server Entry Point)
What this file does
Starts Express server
Adds middleware
Connects DB
Registers routes

populate() function in mongoose is used for populating the data inside the reference.
req.params->used to read url parameters.
_id is MongoDB’s unique identifier for every document.

controllers()->functions

async-await (bhai bhai)

404 error-> server could not find the requested webpage
400 error-> server cannot process the request because something is wrong with the client's send data.
201-> success
500-> server encountered unexpected error couldn't process/handle it

"implemented a complete auction lifecycle — creation, real-time bidding with validation, automatic expiry handling, and winner declaration — all backed by MongoDB with clean REST APIs.”

-----------------------------Frontend Part-------------------------------------------
service layer is a file that handles all http requests to the backend.
#components should not know backend url's
fetch()->browswer API to call backend
BASE_URL->single source of truth
async/await->handle api response
json.stringify()->send json body
json.parse(data)-> to parse a string data into a js object

📌 HTTP vs HTTPS
Environment	Protocol
Local development	http://
Production (real site)	https://

HTTPS requires SSL certificates
Your local Node server does NOT have SSL

So never use HTTPS locally unless you set SSL explicitly.

react=ui is a function of state i.e we dont manually update ui,update state. react re-renders ui automatically
component is a function that return ui(jsx). input->state/props output->ui
jsx-> lets us write html like code inside javascript. bts:- jsx->React.createElement() we dont manipulate dom react does it.

useState->
const[auctions,setAuctions]=useState([]);
state is data that can change over time & affects ui.
here auctions=current data shown, setAuctions=function to update it
when we call setAuctions(data) then react says state changed->re-render UI.

useEffect-> it runs side effects(api calls,timers,subscriptions)
useEffect(()=>{
    fetchAuctions();
},[]); []-> means run this effect only once,when component loads
#we cannot call api's directly while rendering ui so we use useEffect.
perfect for api calls,initial data fetch.

Mental Model

Compare to backend:
Backend       | 	React
Server starts |	Component mounts
Call DB once  |Fetch API once

async api call
const data=await getAllAuctions();
setAuctions(data);

call backend->get auction list->update state->react re-renders ui
# we never manipulate dom manually.

.map()->react needs an array of jsx elements.
converts array of data->array of ui blocks

key helps react identify which item changed.
Rules-> 1.always use unique id,2.never use index if possible

#logic to build a page
1.what data do i need? Auction list->useState([])
2.when should i fetch it? on page load->useEffect([],..)
3.how to show it? Array->map->jsx
4.what if data is empty? conditional rendering

useParams()->read url parameters
link->client side navigation
controlled input-> input linked to state
re-fetch after post->sync ui with backend

Backend changed data ✅
Frontend still has old state ❌

So you must:

Fetch updated data → setState → re-render

React rule:

UI updates only when state changes


node.js-> it gives javascript opportunity to run outside browser that why's it is called javascript runtime environment.
it is used for server side programming
it is not library,frameowork or language.

runtime environment means ability to run outside browser previously we are able to use javascript in frontend part only using browser b/c browser have interpretors for understanding javascript, but now using node.js we can build backend(web server) previously we need to rely on python or other languages.

node.js is based on javascript 
& it is javascript runtime env -> ability to run outside browser.

# vs code is also build on node.js

express-> a node.js web application framework that helps us to make web applications.
it is a package inside npm