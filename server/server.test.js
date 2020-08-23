const app= require('./server.js');
const supertest= require('supertest');
const request=supertest(app)
const fs= require('fs').promises
const testRecordsObg={"winnerName":"noga","date":"20.8.2020, 20:18:44","gameTime":18,"id":2}
const filePath= process.env.TEST || './records.json';

test('server get', async()=>{
    await request.get(filePath)
    .expect([testRecordsObg])
});

test('server post', async()=>{
    await request.post(filePath)
    .send(testRecordsObg)
    .expect('done')
});

test('server get after post', async()=>{
    await request.get(filePath)
    expect([testRecordsObg,testRecordsObg])
    await fs.writeFile(filePath, [testRecordsObg])
});
