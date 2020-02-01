'use strict';
require('dotenv').config()
const bcrypt = require('bcrypt');

const trueValue = 'true';

var Pool = require('../../dbConnection');
const pool = Pool.pool

exports.createUser = async function(request, response) {
  const administrator = false; //const administrator = (request.body.administrator == trueValue) ? true : false ;
  const admin = request.body.admin;
  const newCard = request.body.newCard;
  var hashedUid
  
  /*try {
    const salt = await bcrypt.genSalt()
    hashedUid = await bcrypt.hash(request.body.uid, salt)
  } catch {
    response.status(500).send()
  }*/

  pool.query('SELECT id, administrator FROM public."user" WHERE uid = \'' + admin + '\'', (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows[0].administrator == true) {
      pool.query('INSERT INTO public."user" VALUES (\'' + newCard + '\', DEFAULT, \'' + administrator + '\') RETURNING *', (error, results) => {
          if (error) {
              throw error
          }
          response.status(200).json({ info: `Added: ${newCard}` }).send()
      });
    } else {
      response.status(401).json({ info: 'Not administrator!' }).send()
    }
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
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM public."user" WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
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

/*exports.enter = function(request, response) {
  pool.query('SELECT id, uid, administrator FROM public."user" ORDER BY id ASC', (error, results) => {
    if (error) {
        throw error
    }
    results.rows.forEach(async function(row) {
      try {
        if(await bcrypt.compare(request.body.uid, row.uid)) {
          console.log(`${row.id} logged in`)
          response.status(200).json({ info: 'success' }).send()
        } else {
          console.log(`${row.id} not allowed`)
          
        }
      } catch (err) {
        response.status(500).send("Server error")
      }
    })
    response.status(401).json({ info: 'not allowed' }).send()
  })
}*/
