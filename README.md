# Node.js Backend

This repository contains a Node.js backend application that can be run using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shodh-ai/pronity-backend.git
cd pronity-backend
```

### 2. Make the entrypoint script executable

Before running the application, you need to make the entrypoint script executable:

```bash
chmod +x entrypoint.sh
```

### 3. Start the application

Use Docker Compose to build and start the application:

```bash
docker compose up
```

To run the application in detached mode (in the background):

```bash
docker compose up -d
```

### 4. Stop the application

To stop the running containers:

```bash
docker compose down
```

## API Documentation

## Base URL

```
http://localhost:8000
```

---

## Authentication

### Register

* **URL:** `/auth/register`
* **Method:** POST
* **Body:**

```json
{
  "email": "example@demo.com",
  "password": "password"
}
```

### Login

* **URL:** `/auth/login`
* **Method:** POST
* **Body:**

```json
{
  "email": "example@demo.com",
  "password": "password"
}
```

### Check Token

* **URL:** `/user/info`
* **Method:** GET
* **Auth:** Bearer Token

---

## Interests

### Add Interest

* **URL:** `/interest/add`
* **Method:** POST
* **Body:**

```json
{
  "interestName": "Cooking"
}
```

### Get All Interests

* **URL:** `/interest/all`
* **Method:** GET

### Delete Interest

* **URL:** `/interest/delete`
* **Method:** DELETE
* **Body:**

```json
{
  "interestName": "Cooking"
}
```

---

## Topics

### Add Topic

* **URL:** `/topic/add`
* **Method:** POST
* **Body:**

```json
{
  "topicName": "Web Development",
  "topicField": "Tech",
  "level": 0
}
```

### Get All Topics

* **URL:** `/topic/all`
* **Method:** GET

### Delete Topic

* **URL:** `/topic/delete`
* **Method:** DELETE
* **Body:**

```json
{
  "topicName": "Web Development"
}
```

---

## Words

### Add Word

* **URL:** `/word/add`
* **Method:** POST
* **Body:**

```json
{
  "word": "Game Development",
  "meaning": "Tech",
  "example": "Web"
}
```

### Get All Words

* **URL:** `/word/all`
* **Method:** GET

### Delete Word

* **URL:** `/word/delete`
* **Method:** DELETE
* **Body:**

```json
{
  "word": "Web Development"
}
```

---

## User

### Add User Details

* **URL:** `/user/fill-details`
* **Method:** POST
* **Auth:** Bearer Token
* **Body:**

```json
{
  "firstName": "Shodh",
  "lastName": "AI",
  "occupation": "AI Engineer",
  "major": "Computer Science",
  "nativeLanguage": "Hindi",
  "interests": ["id1", "id2"]
}
```

### Add User Report

* **URL:** `/user/add-report`
* **Method:** POST
* **Auth:** Bearer Token
* **Body:**

```json
{
  "type": "speaking",
  "user_text": "This is a example of wrong sentence.",
  "topicId": "some-topic-id",
  "comments": [
    {
      "start": 10,
      "end": 11,
      "rightText": "an",
      "info": "Use 'an' instead of 'a' before a word starting with a vowel sound."
    },
    {
      "start": 23,
      "end": 28,
      "rightText": "incorrect",
      "info": "Consider replacing 'wrong' with 'incorrect' for better clarity."
    }
  ]
}
```

### Get All Reports

* **URL:** `/user/get-reports`
* **Method:** GET
* **Auth:** Bearer Token

### Get Report by ID

* **URL:** `/user/get-report-by-id?id={reportId}`
* **Method:** GET
* **Auth:** Bearer Token

### Generate Flow

* **URL:** `/user/generate-flow`
* **Method:** GET
* **Auth:** Bearer Token

### Get All Flow

* **URL:** `/user/get-flow`
* **Method:** GET
* **Auth:** Bearer Token

### Get Next in Flow

* **URL:** `/user/get-next-flow`
* **Method:** GET
* **Auth:** Bearer Token

### Generate User Topics

* **URL:** `/user/generate-user-topics`
* **Method:** GET
* **Auth:** Bearer Token

### Get User Topics

* **URL:** `/user/get-user-topics`
* **Method:** GET
* **Auth:** Bearer Token

### Get User Practise Topics

* **URL:** `/user/get-practise-topic`
* **Method:** GET
* **Auth:** Bearer Token

### Add Note

* **URL:** `/user/add-note`
* **Method:** POST
* **Auth:** Bearer Token
* **Body:**

```json
{
  "heading": "Test",
  "content": "Sample note content"
}
```

### Get User Notes

* **URL:** `/user/get-notes`
* **Method:** GET
* **Auth:** Bearer Token

### Get User Words

* **URL:** `/user/get-user-words`
* **Method:** GET
* **Auth:** Bearer Token

### Learn New Word

* **URL:** `/user/learn-new-word`
* **Method:** GET
* **Auth:** Bearer Token
