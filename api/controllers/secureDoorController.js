'use strict';
require('dotenv').config()

const trueValue = 'true';

var Pool = require('../../dbConnection');
const pool = Pool.pool

exports.createUser = async function(request, response) {
  const administrator = false;
  const admin = request.body.admin;
  const newCard = request.body.newCard;

  pool.query('SELECT id, administrator FROM public."user" WHERE uid = \'' + newCard + '\'', (error, res) => {
    if (error) {
      throw error
    }
    if (res && res.rows && res.rows[0] && res.rows[0].administrator !== undefined && (res.rows[0].administrator === true || res.rows[0].administrator === false)) {
      response.status(401).json({ info: 'USER ALREADY EXISTS!' })
    } else {
      pool.query('SELECT id, administrator FROM public."user" WHERE uid = \'' + admin + '\'', (error, results) => {
        if (error) {
          throw error
        }
        if (results && results.rows && results.rows[0] && results.rows[0].administrator !== undefined && results.rows[0].administrator === true) {
          pool.query('INSERT INTO public."user" VALUES (\'' + newCard + '\', DEFAULT, \'' + administrator + '\') RETURNING *', (error, results) => {
              if (error) {
                  throw error
              }
              response.status(200).json({ info: `Added: ${newCard}` })
          });
        } else {
          response.status(401).json({ info: 'NOT ADMINISTRATOR!' })
        }
      });
    }
  });
}

exports.createUserDebug = async function(request, response) {
  const administrator = true;
  const newCard = request.body.newCard;

  pool.query('INSERT INTO public."user" VALUES (\'' + newCard + '\', DEFAULT, \'' + administrator + '\') RETURNING *', (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json({ info: `Added: ${newCard}` }).send()
  });
}


exports.getUsers = function(request, response) {
  pool.query('SELECT id, uid, administrator FROM public."user" ORDER BY id ASC', (error, results) => {
  if (error) {
      throw error
  }
  response.status(200).json(results.rows)
  })
}

exports.getUsersById = function(request, response) {
  const id = parseInt(request.params.id)

  pool.query('SELECT id, administrator FROM public."user" WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows[0].username, request.role.username) {
      response.status(200).json(results.rows)
    } else {
      response.status(401).json("Not allowed")
    }
  })
}

exports.deleteUser = function(request, response) {
  const uid = request.params.uid
  const admin = request.body.admin

  pool.query('SELECT id, administrator FROM public."user" WHERE uid = \'' + uid + '\'', (error, res) => {
    if (error) {
      throw error
    }
    if (res && res.rows && res.rows[0] && res.rows[0].administrator !== undefined && (res.rows[0].administrator === true || res.rows[0].administrator === false)) {
      pool.query('SELECT id, administrator FROM public."user" WHERE uid = \'' + admin + '\'', (error, results) => {
        if (error) {
          throw error
        }
        if (results && results.rows && results.rows[0] && results.rows[0].administrator !== undefined && results.rows[0].administrator === true) {
          pool.query('DELETE FROM public."user" WHERE uid = \'' + uid + '\'', (error, results) => {
            if (error) {
              throw error
            }
            response.status(200).json({ info: `Deleted: ${uid}` }).send()
          })
        } else {
          response.status(401).json({ info: 'NOT ADMINISTRATOR!' }).send()
        }
      })
    } else {
      response.status(401).json({ info: 'USER DOES NOT EXIST!' })
    }
  })
}

exports.enter = function(request, response) {
  pool.query('SELECT id, uid, administrator FROM public."user" WHERE uid = \'' + request.body.uid + '\'', (error, results) => {
    if (error) {
        throw error
    }
    if (results.rows[0]) {
      response.status(200).json({ info: 'success' }).send()
    } else {
      response.status(401).json({ info: 'not allowed' }).send()
    }
  });
}