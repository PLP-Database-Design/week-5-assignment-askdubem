const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const mysql = require('mysql2')


const app = express()

app.use(cors)
app.use(express.json())
dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err)=>{
    if(err){
        console.log(`Error connecting to mySQL: ${err}`)
    }else{
        console.log('Connected to mySQL')
    }
})

app.get('/data', (req, res)=>{
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', 
    (err, results)=>{
        if(err){
            console.log(err)
            res.status(500)
        }else{
            res.render('data', {results: results})
        }
    })
})

// Question 2
app.get('/data', (req, res)=>{
    db.query('SELECT first_name, last_name, provider_specialty', 
    (err, results)=>{
        if(err){
            console.log(err)
            res.status(500)
        }else{
            res.render('data', {results: results})
        }
    })
})

//Question 3
app.get('/patiant/:first_name', (req, res)=>{
    const firstName = req.params.first_name;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    db.query(query, [firstName],  
    (err, results)=>{
        if(err){
            console.log(err)
            return res.status(500)
        }

        if (results.length === 0) {
            return res.status(404).send('No patients found with the given first name');
        }
        
        res.json(results)
        
    })
})

// Question 4
app.get('/provider/:specialty', (req, res)=>{
    const specialty = req.params.specialty;
    const query = 'SELECT * FROM providers WHERE specialty = ?';

    db.query(query, [specialty],  
    (err, results)=>{
        if(err){
            console.log(err)
            return res.status(500)
        }

        if (results.length === 0) {
            return res.status(404).send('No patients found with the given first name');
        }
        
        res.json(results)
        
    })
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})