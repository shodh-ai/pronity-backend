// Script to test the speaking practice endpoints using proper form-data handling
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'http://localhost:8000';
let TOKEN = '';
let USER_ID = '';

// Register a test user
async function registerTestUser() {
  try {
    console.log('Registering test user...');
    
    // Generate a unique email to avoid conflicts
    const timestamp = new Date().getTime();
    const registerData = {
      email: `test_user_${timestamp}@example.com`,
      password: 'testpassword',
      name: 'Test User'
    };
    
    console.log(`Registering with email: ${registerData.email}`);
    
    const response = await axios.post(
      `${API_URL}/auth/register`,
      registerData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    TOKEN = response.data.token;
    USER_ID = response.data.user.id;
    
    console.log('Registration successful!');
    console.log('Token:', TOKEN ? 'Obtained token successfully' : 'Failed to get token');
    console.log('User ID:', USER_ID);
    
    return { token: TOKEN, userId: USER_ID };
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
}

// Test save transcription endpoint
async function testSaveTranscription() {
  try {
    console.log('Testing /speaking/save-transcription endpoint...');
    
    const transcriptionData = {
      userId: USER_ID,
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
    
    // Create a test audio file
    const testAudioFilePath = path.join(__dirname, 'test-audio.webm');
    if (!fs.existsSync(testAudioFilePath)) {
      // Create a simple empty file for testing
      fs.writeFileSync(testAudioFilePath, Buffer.from('Test audio content'));
    }
    
    // Create form data for the file upload
    const form = new FormData();
    form.append('practiceId', practiceId);
    form.append('audio', fs.createReadStream(testAudioFilePath));
    
    const response = await axios.post(
      `${API_URL}/speaking/upload-audio`,
      form,
      {
        headers: {
          ...form.getHeaders(),
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
    // First register a test user
    await registerTestUser();
    
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

// Run the tests
runTests();
