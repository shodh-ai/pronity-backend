// Simple test script to check the flow API endpoints
const fetch = require('node-fetch');

// Settings
const API_URL = 'http://localhost:8000';
const TOKEN = process.argv[2]; // Pass token as command line argument

if (!TOKEN) {
  console.error('Please provide a valid JWT token as command line argument');
  console.error('Usage: node test-flow.js YOUR_JWT_TOKEN');
  process.exit(1);
}

// Test the flow API endpoints
async function testFlowApi() {
  console.log('Testing Flow API with token:', TOKEN.substring(0, 10) + '...');
  
  try {
    // 1. Test GET /flow/tasks/flow endpoint
    console.log('\n1. Testing GET /flow/tasks/flow');
    const flowResponse = await fetch(`${API_URL}/flow/tasks/flow`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    console.log('Response status:', flowResponse.status);
    if (flowResponse.ok) {
      const flowData = await flowResponse.json();
      console.log('Success! Flow data:', JSON.stringify(flowData, null, 2));
    } else {
      const errorText = await flowResponse.text();
      console.error('Error response:', errorText);
    }
    
    // 2. Test POST /flow/tasks/flow/next endpoint
    console.log('\n2. Testing POST /flow/tasks/flow/next');
    const nextResponse = await fetch(`${API_URL}/flow/tasks/flow/next`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    console.log('Response status:', nextResponse.status);
    if (nextResponse.ok) {
      const nextData = await nextResponse.json();
      console.log('Success! Next flow data:', JSON.stringify(nextData, null, 2));
    } else {
      const errorText = await nextResponse.text();
      console.error('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testFlowApi();
