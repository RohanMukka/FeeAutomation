var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../mysql-config');
var pass = require('../passport-config');
const cors = require('./cors');
const depts = {
  'CSE': 'Computer Science & Engineering',
  'ECE': 'Electronics & Communication Engineering',
  'CE': 'Civil Engineering',
  'ME': 'Mechanical Engineering',
  'AE': 'Applied Electronics',
  'EE': 'Electrical & Electronics Engineering',
  'IE': 'Industrial Engineering',
  'AR': 'Architecture'
};

function isValid(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

//get Date in IST format
function getISTDate() {
  let dateUTC = new Date();
  dateUTC = dateUTC.getTime()
  let dateIST = new Date(dateUTC);
  dateIST.setHours(dateIST.getHours() + 5);
  dateIST.setMinutes(dateIST.getMinutes() + 30);
  return dateIST;
}

//get admin details
router.options('/', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.get('/', cors.corsWithOptions, pass.verifyUser, function (req, res, next) {
  const query = "SELECT username,name,role from users where username=?";
  db.query(query, [req.user.username], (err, result) => {
    res.statusCode = 200;
    res.json(result[0]);
  });
});

//search for student
router.options('/search', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.get('/search', cors.corsWithOptions, pass.verifyUser, function (req, res, next) {
  let query = "SELECT s.admno,s.name,s.programme,s.sem,s.dept,s.paidornot,c.scholname,f.deadline,DATE_FORMAT(f.deadline,'%d %M %Y') as dlday, dateofpayment FROM students s,fees f,scholarships c WHERE s.sem=f.sem and s.programme=f.programme and s.scholid=c.scholid";
  let keys = Object.keys(req.query);
  let values = Object.values(req.query);
  let params = [];
  for (let i = 0; i < keys.length; ++i) {
    if (!isValid(values[i])) {
      return res.status(400).json({ error: true, msg: 'Invalid parameters' });
    }
    let table = 's';
    if (keys[i] == 'scholname') {
      table = 'c';
    }
    query += (" and " + table + "." + keys[i] + "=?");
    params.push(values[i]);
  }
  db.query(query, params, function (err, result) {
    if (err)
      return err;
    if (result.length == 0) {
      res.statusCode = 404;
      res.json({ error: true, msg: 'No students found' });
    }
    else {
      let rows = [];
      result.forEach((row) => {
        let fine = 'No';
        let paid = row.paidornot === 0 ? 'No' : 'Yes';
        let today = new Date();
        let dayslate;
        if (!row.paidornot)
          dayslate = Math.floor((today.getTime() - row.deadline.getTime()) / (1000 * 60 * 60 * 24));
        else
          dayslate = Math.floor((row.dateofpayment.getTime() - row.deadline.getTime()) / (1000 * 60 * 60 * 24));
        if (dayslate > 0) {
          fine = 'Yes';
        }
        let dept = depts[row.dept];
        res.statusCode = 200;
        let resRow = Object.assign(
          {
            'admno': row.admno,
            'name': row.name,
            'prog': row.programme,
            'sem': row.sem,
            'schol': row.scholname,
            'deadline': row.dlday,
            'dept': dept,
            'paid': paid,
            'fine': fine,
            'reset': 0
          }
        );
        rows.push(resRow);
      });
      res.json(rows);
    }
  });
});

//add new student details
router.options('/addStudents', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.post('/addStudents', cors.corsWithOptions, pass.verifyUser, function (req, res, next) {
  let keys = Object.keys(req.body);
  let values = keys.map(k => req.body[k]);
  for (let v of values) {
    if (!isValid(v)) {
      return res.status(400).json({ error: true, msg: 'Invalid data' });
    }
  }
  const placeholders = keys.map(() => '?').join(',');
  let query = `INSERT INTO students(${keys.join(',')}) VALUES (${placeholders})`;
  db.query(query, values, async (err, result) => {
    if (err)
      return err;
    else {
      let date = req.body.dob;
      let year = date.slice(0, 4);
      let month = date.slice(5, 7);
      let day = date.slice(8, 10);
      let ddmmyyyy = day + month + year;
      let hashedPassword = await bcrypt.hash(ddmmyyyy, 10);
      let query2 = "INSERT into users VALUES(?,?,?,?)";
      db.query(query2, [req.body.admno, hashedPassword, req.body.name, 'student'], (err, result) => {
        if (err)
          return err;
        else
          res.json({ success: true });
      });
    }
  });
});

//add new admin
router.options('/addAdmin', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.post('/addAdmin', cors.corsWithOptions, async function (req, res, next) {
  if (!isValid(req.body.collegeid) || !isValid(req.body.name) || !isValid(req.body.password)) {
    return res.status(400).json({ error: true, msg: 'Invalid data' });
  }
  let hashedPassword = await bcrypt.hash(req.body.password, 10);
  let query = "INSERT INTO users VALUES(?,?,?,?)";
  db.query(query, [req.body.collegeid, hashedPassword, req.body.name, 'admin'], (err, result) => {
    if (err) {
      res.statusCode = 500;
      return res.json(err);
    }
    else {
      res.json({ success: true });
    }
  });
});

//mark paid for offline payment
router.options('/markPaid', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.post('/markPaid', cors.corsWithOptions, pass.verifyUser, (req, res, next) => {
  if (!isValid(req.body.admno)) {
    return res.status(400).json({ error: true, msg: 'Invalid data' });
  }
  let date = getISTDate();
  date = date.toISOString().slice(0, 19).replace('T', ' ');
  let query = "UPDATE students SET paidornot=1, dateofpayment=? WHERE admno=?";
  db.query(query, [date, req.body.admno], (err, result) => {
    if (err) {
      res.statusCode = 500;
      return res.json(err);
    }
    else {
      res.json({ success: true });
    }
  });
});

//studentpassword reset
router.options('/resetStudentPassword', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.post('/resetStudentPassword', cors.corsWithOptions, pass.verifyUser, (req, res, next) => {
  if (!isValid(req.body.admno)) {
    return res.status(400).json({ error: true, msg: 'Invalid data' });
  }
  let query = "SELECT DATE_FORMAT(dob,'%d%m%Y') as date from students where admno=?";
  db.query(query, [req.body.admno], async (err,result) => {
    if(err){
      res.statusCode = 500;
      return res.json(err);      
    }
    else {
      let hashedPassword = await bcrypt.hash(result[0].date, 10);
      let query2 = "UPDATE users set password=? WHERE username=?";
      db.query(query2, [hashedPassword, req.body.admno], (err, result) => {
        if (err) {
          res.statusCode = 500;
          return res.json(err);
        }
        else
          res.json({ success: true });
      });
    }
  })
});
module.exports = router;