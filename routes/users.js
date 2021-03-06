'use strict';

const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const bcrypt = require('bcrypt-as-promised');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next)=> {
  bcrypt.hash(req.body.password, 12)
  .then((hashedPassword) => {
    return knex('users')
    .insert({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      hashed_password: hashedPassword
    }, '*')
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      res.send(camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });


  });
});

module.exports = router;
