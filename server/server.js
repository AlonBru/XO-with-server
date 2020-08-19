const express = require('express');
const app = express();
const fs = require('fs').promises;
app.use(express.json());

// app.use('/',express.static('../client/build/index'));

app.get('/api/records',async (req,res)=>{
    const content = await fs.readFile('./records.json');
    const json = JSON.parse(content)
    res.send(json);
})


app.post('/api/records', async (req,res)=>{
    // const newWinner = JSON.parse(req.body)
    const records = await fs.readFile('./records.json')
    const json = JSON.parse(records)
    json.push(req.body)
    await fs.writeFile('./records.json',`${JSON.stringify(json)}`)  

    res.send(json) 
});



app.listen(8080);