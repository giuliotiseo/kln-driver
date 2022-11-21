/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

require('dotenv').config();
var cors = require('cors')
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const verifyJWT = require('./middleware/verifyJWT');
const verifyJWTAdmin = require('./middleware/verifyJWTAdmin');
const cookieParser = require('cookie-parser');

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
const PORT = process?.env?.PORT || 3500;

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware for cookies
app.use(cookieParser());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/update', require('./routes/update'));
app.use('/restore', require('./routes/restore'));

// Routes da proteggere...
app.use(verifyJWT);
app.use('/profiles', require('./routes/api/profiles'));

app.use(verifyJWTAdmin);
app.use('/register', require('./routes/register'));

app.listen(PORT, function() {
  console.log(`App started on port ${PORT}`);
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
