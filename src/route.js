const express = require("express");
const router = express();

/**
 * Here I am defining routes for the application
 * The thing is order of routes matters in express.
 */

/**
 * ! eg number 1
 * router.use("/", (req, res) => {
 *  res.send("I will respond to all the requests starting with /");
 * Here I have placed this route at the top. So this route will respond to all the requests
 * starting with /
 * Hence the below routes will never be reached.
 * });
 */

/**
 * router.use("/hello", (req, res) => {
 * res.send("hello from /hello endpoint");
 * Here the /hello route is placed below / route so this route is never reached and hence sequence of routes really matters If you want to reach to /hello route then place this route above / route
 * });
 *  */

/**
 * !eg number 2
 * ? router.use("/hello",(req,res)=>{
 * ?res.send("hello from /hello endpoint");
 * ?});
 *
 *? router.use("/hello/world",(req,res)=>{
 *? res.send("hello from /hello/world endpoint");
 *? });
 * ?Here in this example if we place /hello route above /hello/world route then /hello/world route will never be reached because all the requests starting with /hello will be handled by /hello route
 *
 * So the correct order is to place more specific routes above less specific routes
 * Below is the correct order
 *
 *? router.use("/hello/world",(req,res)=>{
 *? res.send("hello from /hello/world endpoint");
 *? });
 *
 *? router.use("/hello",(req,res)=>{
 *? res.send("hello from /hello endpoint");
 *? });
 * ! Now if we make a request to /hello/world endpoint it will be handled by /hello/world route
 * ! and if we make a request to /hello endpoint it will be handled by /hello route
 * ! and if we make a request to /hello123 endpoint it will not be handled by /hello route because /hello route only handles requests to /hello endpoint hello string is different from hello123 string
 * ! and if no route matches the request then we can have a default route at the end to handle such requests
 *
 *? router.use("/",(req,res)=>{
 *? res.send("I will respond to all the requests starting with /");
 *? });
 *
 *
 *
 */
