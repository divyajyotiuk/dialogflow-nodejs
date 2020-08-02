const dialogflow = require('dialogflow').v2beta1;
const uuid = require('uuid');

// const auth = require('google-auth-library');
// const oauth2client = new auth.OAuth2Client(
//     client_id,
//     client_secret, 
//     'https://localhost:3000');    //callback_uri
//   const authUrl = oauth2client.generateAuthUrl({
//     access_type: 'offline',
//     scope: [    // scopes for Dialogflow
//       'https://www.googleapis.com/auth/cloud-platform',
//       'https://www.googleapis.com/auth/dialogflow'
//     ]
// });

// BEST ON SERVER SIDE


/**
 * Note: DialogFlow and other Google Cloud services are compatible to server side. 
 * Extra authentication required since this project uses it on client side. 
 * Recommeded to use this package on server. 
 * https://github.com/googleapis/nodejs-dialogflow/issues/405  
 * The dialogflow team specifies so.
 */
 
// redirect user to authUrl and wait for them coming back to callback_uri

// in callback_uri handler, get the auth code from query string and obtain a token:

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function init(code, oauth2client, projectId = '') {  //update your project ID

    const tokenResponse = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokenResponse.tokens);
    // A unique identifier for the given session
    const sessionId = uuid.v4();

    console.log(dialogflow);
    // Create a new session

    const sessionClient = new dialogflow.SessionsClient({ auth: oauth2client});
    //const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const sessionPath = `projects/${projectId}/agent/sessions/${sessionId}`;

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: 'hello',
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
}

export default init;