const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5100; // changed on feature branch

// --- Mock in-memory "IoT" data --------------------------------------------

let resources = [
  { id: 1, name: 'Lecture Hall A', type: 'Room', status: 'Available', occupancy: 0, capacity: 120 },
  { id: 2, name: 'Lecture Hall B', type: 'Room', status: 'In Use', occupancy: 84, capacity: 100 },
  { id: 3, name: 'CS Lab 1', type: 'Lab', status: 'In Use', occupancy: 32, capacity: 40 },
  { id: 4, name: 'Main Library', type: 'Facility', status: 'Available', occupancy: 210, capacity: 500 },
  { id: 5, name: 'AC Unit - Block C', type: 'Equipment', status: 'Warning', occupancy: null, capacity: null },
];

let energyReadings = [
  { id: 1, zone: 'Block A', kwh: 45.2, timestamp: new Date().toISOString() },
  { id: 2, zone: 'Block B', kwh: 61.7, timestamp: new Date().toISOString() },
  { id: 3, zone: 'Block C', kwh: 88.9, timestamp: new Date().toISOString() },
];

let alerts = [
  { id: 1, resourceId: 5, severity: 'Medium', message: 'AC Unit Block C showing abnormal vibration pattern - predicted maintenance needed within 7 days.' },
];

// --- Routes ------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'smart-campus-backend', time: new Date().toISOString() });
});

app.get('/api/resources', (req, res) => {
  res.json(resources);
});

app.get('/api/resources/:id', (req, res) => {
  const resource = resources.find(r => r.id === parseInt(req.params.id));
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json(resource);
});

app.patch('/api/resources/:id', (req, res) => {
  const resource = resources.find(r => r.id === parseInt(req.params.id));
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  Object.assign(resource, req.body);
  res.json(resource);
});

app.get('/api/energy', (req, res) => {
  res.json(energyReadings);
});

app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.listen(PORT, () => {
  console.log(`Smart Campus backend running on port ${PORT}`);
});

// Maintenance request endpoint (added on feature/maintenance-endpoint)
let maintenanceRequests = [];

app.post('/api/maintenance', (req, res) => {
  const request = {
    id: maintenanceRequests.length + 1,
    resourceId: req.body.resourceId,
    description: req.body.description || '',
    status: 'Open',
    createdAt: new Date().toISOString(),
  };
  maintenanceRequests.push(request);
  res.status(201).json(request);
});

app.get('/api/maintenance', (req, res) => {
  res.json(maintenanceRequests);
});
