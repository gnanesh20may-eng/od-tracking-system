// simple script to test duty creation via controller directly
// run with `node testCreateDuty.js`

require('dotenv').config();
const DutyRequest = require('./src/models/DutyRequest');
const { createDuty } = require('./src/controllers/dutyController');

async function run() {
  // mock request/response objects
  const req = {
    body: {
      staffId: 1,
      dutyDate: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // tomorrow
      startTime: '10:00',
      endTime: '12:00',
      latitude: 28.5355,
      longitude: 77.3910,
      radius: 500
    },
    user: { id: 1, email: 'test@example.com', role: 'admin' }
  };
  const res = {
    status(code) { this._code = code; return this; },
    json(obj) { console.log('RESPONSE', this._code, obj); }
  };

  await createDuty(req, res);
}

run().catch(console.error);
