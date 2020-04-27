const express = require('express');
const app = express();
const cors = require('cors');
const auth = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`app listening on port ${port}`));

// gateway >> auth service
// frontend >> gateway >> authservice

// Post /api/auth
// post /api/posts
// post /api/comrev

/*
  {
    action: 'keyword ex: registerUser, loginUser, registerProfile, getSelf',
    reqBody: {
      body
    }
  }
  auth token still sent via x-auth-token header key
*/
