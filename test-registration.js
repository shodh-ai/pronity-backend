import fetch from 'node-fetch';

async function testRegistration() {
  try {
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'brand_new_user_456@gmail.com',
        password: 'password123',
        name: 'Test User'
      }),
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegistration();

