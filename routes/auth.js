const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authServer } = require('../config/default');

//  @route POST api/auth
//  @desc authentication route for gateway
//  @access public
router.post('/', async (req, res) => {
  try {
    let response;

    switch (req.body.action) {
      case 'registerUser':
        response = await registerUser(req.body.reqBody);
        break;

      case 'loginUser':
        response = await loginUser(req.body.reqBody);
        break;

      case 'registerProfile':
        response = await registerProfile(req);
        break;

      case 'getSelf':
        response = await getSelf(req);
        break;

      default:
        return res.status(404).json({ errors: { action: 'Invalid Request' } });
    }

    if (response.errors) throw response.errors;
    res.json(response.data);
  } catch (error) {
    console.error('error', error);

    if (error.msg.includes('No token')) {
      res.status(401).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

const registerUser = async (body) => {
  console.log('gateway action registerUser');
  try {
    const response = await axios.post(`${authServer}/api/users`, body);
    return response;
  } catch (error) {
    console.error(error.response.data);
    return error.response.data;
  }
};

const loginUser = async (body) => {
  console.log('gateway action login');

  try {
    const response = await axios.post(`${authServer}/api/users/login`, body);
    return response;
  } catch (error) {
    console.error(error.response.data);
    return error.response.data;
  }
};

const registerProfile = async (req) => {
  const token = req.header('x-auth-token');

  //decide if token is confirmed here on microservice
  if (token) {
    try {
      const response = axios.post(
        `${authServer}/api/profiles`,
        req.body.profileData,
        {
          headers: { 'x-auth-token': token },
        }
      );
      return response;
    } catch (error) {
      console.error(error.response.data);
      return error.response.data;
    }
  } else {
    return { errors: { msg: 'No token, authorization denied' } };
  }
};

const getSelf = async (req) => {
  const token = req.header('x-auth-token');

  if (token) {
    try {
      const response = axios.get(`${authServer}/api/profiles/self`, {
        headers: { 'x-auth-token': token },
      });

      return response;
    } catch (error) {
      console.error(error.response.data);
      return error.response.data;
    }
  } else {
    return { errors: { msg: 'No token, authorization denied' } };
  }
};

module.exports = router;
