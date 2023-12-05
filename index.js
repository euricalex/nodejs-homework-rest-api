const ElasticEmail = require('@elasticemail/elasticemail-client');
const dotenv = require("dotenv");

dotenv.config();
const {ELASTIC_API_KEY, EMAIL_FROM} = process.env;
 
const defaultClient = ElasticEmail.ApiClient.instance;
const {apikey} = defaultClient.authentications;
apikey.apiKey = ELASTIC_API_KEY;
 
const api = new ElasticEmail.EmailsApi();
const email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [
      new ElasticEmail.EmailRecipient("urevaleksandr468@gmail.com")
    ],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: "<strong>Test email</strong>"
        })
      ],
      Subject: "From Node.js with love",
      From: EMAIL_FROM
    }
  });
   
  const callback = function(error, data, response) {
    if (error) {
      console.error(error.message);
    } else {
      console.log('API called successfully.');
    }
  };
  
  
  api.emailsPost(email, callback);
 