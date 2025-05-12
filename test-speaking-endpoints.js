// Script to test the speaking practice endpoints
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

const API_URL = 'http://localhost:8000';
let TOKEN = '';
let USER_ID = '';

// Test login to get a JWT token
async function login() {
  try {
    console.log('Authenticating to get JWT token...');
    
    // You may need to create this test user in your database first
    // or use an existing user's credentials
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    const response = await axios.post(
      `${API_URL}/auth/login`,
      loginData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    TOKEN = response.data.token;
    USER_ID = response.data.userId || '123456789'; // Use the returned userId or fallback
    
    console.log('Authentication successful!');
    console.log('Token:', TOKEN ? 'Obtained token successfully' : 'Failed to get token');
    console.log('User ID:', USER_ID);
    
    return { token: TOKEN, userId: USER_ID };
  } catch (error) {
    console.error('Authentication Error:', error.response?.data || error.message);
    // Fallback to mock token for testing
    console.log('Using mock token and user ID for testing...');
    TOKEN = 'mock_token_for_testing';
    USER_ID = '123456789';
    return { token: TOKEN, userId: USER_ID };
  }
}

// Test save transcription endpoint
async function testSaveTranscription() {
  try {
    console.log('Testing /speaking/save-transcription endpoint...');
    
    const transcriptionData = {
      userId: USER_ID, // Using the user ID from login
      questionText: 'Test speaking question',
      transcription: 'This is a test transcription for the speaking practice.',
      duration: 30,
      practiceDate: new Date().toISOString()
    };
    
    console.log(`Using User ID: ${USER_ID} for transcription data`);
    
    const response = await axios.post(
      `${API_URL}/speaking/save-transcription`,
      transcriptionData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        }
      }
    );
    
    console.log('Save Transcription Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Save Transcription Error:', error.response?.data || error.message);
    throw error;
  }
}

// Test upload audio endpoint
async function testUploadAudio(practiceId) {
  try {
    console.log('Testing /speaking/upload-audio endpoint...');
    
    // Create a test audio file (or use an existing one)
    const testAudioFilePath = path.join(__dirname, 'test-audio.webm');
    if (!fs.existsSync(testAudioFilePath)) {
      // Create a simple empty file for testing
      fs.writeFileSync(testAudioFilePath, Buffer.from('Test audio content'));
    }
    
    const formData = new FormData();
    formData.append('practiceId', practiceId);
    formData.append('audio', fs.createReadStream(testAudioFilePath));
    
    const response = await axios.post(
      `${API_URL}/speaking/upload-audio`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${TOKEN}`
        }
      }
    );
    
    console.log('Upload Audio Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload Audio Error:', error.response?.data || error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // First login to get JWT token
    await login();
    
    // Then save transcription
    const savedPractice = await testSaveTranscription();
    
    // Then upload audio for that practice
    if (savedPractice && savedPractice.id) {
      await testUploadAudio(savedPractice.id);
    } else {
      console.log('No practice ID returned, cannot test upload audio');
    }
    
    console.log('All tests completed!');
  } catch (error) {
    console.error('Tests failed:', error.message);
  }
}

// Get the current directory using import.meta.url
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Check if we need to install dependencies
if (!fs.existsSync(path.join(__dirname, 'node_modules/axios'))) {
  console.log('Installing test dependencies...');
  console.log('Please run: npm install axios form-data');
  console.log('Then run this script again.');
} else {
  runTests();
}
