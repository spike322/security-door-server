'use strict';
const fs   = require('fs');

var Pool = require('../dbConnection');
const pool = Pool.pool

const bcrypt = require('bcrypt');

require('dotenv').config()

const trueValue = 'true';

exports.provola = function(req, res) {
    res.status(200).json({ info: 'Todo bien' })
}

exports.createUser = async function(request, response) {
    const administrator = (request.body.administrator == trueValue) ? true : false ;
    var hashedUid
    
    try {
      const salt = await bcrypt.genSalt()
      hashedUid = await bcrypt.hash(request.body.uid, salt)
    } catch {
      response.status(500).send()
    }
  
    pool.query('INSERT INTO public."user" VALUES (\'' + hashedUid + '\', DEFAULT, \'' + administrator + '\') RETURNING *', (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).json({ info: `User added with ID: ${results.rows[0].id}` })
    })
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
  
  

  
  