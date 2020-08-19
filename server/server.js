const express = require('express');
const path = require('path')
const app = express();
const fs = require('fs').promises;
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// app.use("/",express.static('../client/build/index'));
// app.get('/', function(req, res) {
//   res.sendFile('../client/build/index.html');
// });




// app.get('/', function(req, res) {
//     res.sendFile('../client/build/index.html');
//   });

//  app.get('/',async (req,res)=>{
//     const content = await fs.readFile('../client/build/index.html');
//     res.send(content);
// })

app.get('/api/records',async (req,res)=>{
    const content = await fs.readFile('./records.json');
    const json = JSON.parse(content)
    res.send(json);
})


app.post('/api/records', async (req,res)=>{
    const records = await fs.readFile('./records.json')
    const json = JSON.parse(records)
    req.body.id = records.length; 
    json.push(req.body)
    await fs.writeFile('./records.json',`${JSON.stringify(json)}`)  

    res.send(json) 
});



app.listen(8080);