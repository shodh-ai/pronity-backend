import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'brand_new_user_456@gmail.com',
        password: 'password123'
      }),
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (data.token) {
      console.log('\nToken for testing:');
      console.log(data.token);
      
      // Now test the flow endpoint with this token
      console.log('\nTesting flow endpoint with the token...');
      const flowResponse = await fetch('http://localhost:8000/flow/tasks/flow', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log('Flow endpoint status:', flowResponse.status);
      if (flowResponse.ok) {
        const flowData = await flowResponse.json();
        console.log('Flow data:', JSON.stringify(flowData, null, 2));
      } else {
        try {
          const errorData = await flowResponse.json();
          console.log('Error response:', errorData);
        } catch (e) {
          const text = await flowResponse.text();
          console.log('Error response (text):', text || 'Empty response');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
