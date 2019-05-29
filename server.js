const express = require("express");
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;
// Use the array below to store the users. Add/remove/update items in it based off
let storage = [];
app.use(bodyParser.json());

// Create new user
app.post('/create', (req, res) => {
  const user = req.body.user;
  if (user.name && user.email && user.state) {
    const obj = {
      name: user.name,
      email: user.email,
      state: user.state
    }
    fs.readFile('./storage.json', (err, data) => {
      let json = [];
      if (data.length > 0) {
        json = JSON.parse(data);
      }
      obj.id = json.length + 1;
      json.push(obj);
      fs.writeFile('./storage.json', JSON.stringify(json), err => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    });
  } else {
    res.sendStatus(400);
  }
});

// Get all users
app.get('/users', (req, res) => {
  fs.readFile('./storage.json', (err, data) => {
    let json = [];
    if (data.length > 0) {
      json = JSON.parse(data);
      res.json(json);
    } else {
      res.send('No users');
    }
  })
})
// Get user by username
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('./storage.json', (err, data) => {
    let json = [];
    if (data.length > 0) {
      json = JSON.parse(data);
      const result = json.filter(u => {
        return u.id === id;
      })
      if (result.length > 0) {
        res.json(result)
      } else {
        res.sendStatus(400);
      }
    } else {
      res.send('No users');
    }
  })
})

// Update user by name
app.post('/update/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = req.body.user;
  if (user.name && user.email && user.state) {
    const obj = {
      name: user.name,
      email: user.email,
      state: user.state
    }
    fs.readFile('./storage.json', (err, data) => {
      let json = [];
      if (data.length > 0) {
        json = JSON.parse(data);
      }
      const result = json.map(u => {
        if (u.id === id) {
          obj.id = id;
          return obj;
        } else {
          return u;
        }
      })
      fs.writeFile('./storage.json', JSON.stringify(result), err => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    });
  } else {
    res.sendStatus(400);
  }
})

// Delete user by ID
app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('./storage.json', (err, data) => {
    let json = [];
    if (data.length > 0) {
      json = JSON.parse(data);
    }
    let newindex = 1;
    const result = json.filter(u => {
      if (u.id !== id) {
        u.id = newindex;
        newindex++;
        return u;
      }
    })
    fs.writeFile('./storage.json', JSON.stringify(result), err => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


