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

## General

### Test Backend

- **URL:** `/`
- **Method:** GET
- **Example Response (200 OK):**
  ```
  Pronity Service is running!
  ```

---

## Database Info

### Get Schema

- **URL:** `/dbInfo/schema`
- **Method:** GET
- **Example Response (200 OK):**
  ```json
  {
    "Auth": [
      { "column": "email", "type": "text" },
      { "column": "password", "type": "text" },
      { "column": "id", "type": "uuid" }
    ],
    "Comment": [
      { "column": "startIndex", "type": "integer" },
      { "column": "endIndex", "type": "integer" },
      { "column": "wrongText", "type": "text" },
      { "column": "rightText", "type": "text" },
      { "column": "info", "type": "text" },
      { "column": "date", "type": "timestamp without time zone" },
      { "column": "id", "type": "uuid" },
      { "column": "reportId", "type": "uuid" }
    ],
    "FlowElement": [
      { "column": "id", "type": "uuid" },
      { "column": "userId", "type": "uuid" },
      { "column": "type", "type": "text" },
      { "column": "level", "type": "text" },
      { "column": "topic", "type": "text" },
      { "column": "task", "type": "text" },
      { "column": "order", "type": "integer" }
    ],
    "Note": [
      { "column": "heading", "type": "text" },
      { "column": "content", "type": "text" },
      { "column": "date", "type": "timestamp without time zone" },
      { "column": "id", "type": "uuid" },
      { "column": "userId", "type": "uuid" }
    ],
    "Report": [
      { "column": "date", "type": "timestamp without time zone" },
      { "column": "type", "type": "text" },
      { "column": "userText", "type": "text" },
      { "column": "id", "type": "uuid" },
      { "column": "topicId", "type": "uuid" },
      { "column": "userId", "type": "uuid" }
    ],
    "User": [
      { "column": "createdAt", "type": "timestamp without time zone" },
      { "column": "id", "type": "uuid" },
      { "column": "flowId", "type": "uuid" },
      { "column": "analysis", "type": "text" },
      { "column": "confidence", "type": "text" },
      { "column": "currentOrder", "type": "integer" },
      { "column": "feeling", "type": "text" },
      { "column": "goal", "type": "text" },
      { "column": "name", "type": "text" }
    ],
    "Word": [
      { "column": "word", "type": "text" },
      { "column": "meaning", "type": "text" },
      { "column": "example", "type": "text" },
      { "column": "date", "type": "timestamp without time zone" },
      { "column": "id", "type": "uuid" }
    ],
    "_UserWords": [
      { "column": "A", "type": "uuid" },
      { "column": "B", "type": "uuid" }
    ]
  }
  ```

---

## Authentication

### Register

- **URL:** `/auth/register`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "example@demo.com",
    "password": "password"
  }
  ```
- **Example Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiOGU3Njg3MC01MzJlLTRmOWYtYmIwZi0xZjgxMjMxMzg2N2MiLCJpYXQiOjE3NDk4OTgzNDN9.gUWbw2He8akQ1SWv-hDnA7M-fooDBk7o0Xx5Eow_Mww"
  }
  ```

### Login

- **URL:** `/auth/login`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "example@demo.com",
    "password": "password"
  }
  ```
- **Example Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiOGU3Njg3MC01MzJlLTRmOWYtYmIwZi0xZjgxMjMxMzg2N2MiLCJpYXQiOjE3NDk4OTg2Njl9.OCCicdm9yZ2o3Xa9HXFDVb5J95ji4wTICABA9cOwQFc"
  }
  ```

---

## API (LiveKit)

### Generate LiveKit Token

- **URL:** `/api/generate-token`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "roomName": "rox-session-820cbbe2",
    "studentToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6IntcImFwcF9yb2xlXCI6XCJzdHVkZW50XCIsXCJ1c2VyVG9rZW5cIjpcImNhNWQyYjMwLWJkMGItNDZjNS04ZDU2LWY5NDE0NmVhMzYyZlwiLFwidXNlcklkXCI6XCJjYTVkMmIzMC1iZDBiLTQ2YzUtOGQ1Ni1mOTQxNDZlYTM2MmZcIn0iLCJuYW1lIjoiUGFydGljaXBhbnQiLCJ2aWRlbyI6eyJyb29tIjoicm94LXNlc3Npb24tODIwY2JiZTIiLCJyb29tSm9pbiI6dHJ1ZSwiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZX0sImlhdCI6MTc0OTg3Nzc2NSwibmJmIjoxNzQ5ODc3NzY1LCJleHAiOjE3NDk4ODEzNjUsImlzcyI6IkFQSUc4eTNweUEzUDZ5ViIsInN1YiI6InN0dWRlbnQtN2JhNDIwZTMiLCJqdGkiOiJzdHVkZW50LTdiYTQyMGUzIn0.Svs8s5dQ-qVHBr-WFH9X3NdjK144hnvhphyBWh5L28I",
    "livekitUrl": "wss://shodhai-pojmjchi.livekit.cloud"
  }
  ```

---

## User Management

### Get User Info

- **URL:** `/user/info`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation, this is a placeholder based on typical user info endpoints)
  ```json
  {
    "id": "b8e76870-532e-4f9f-bb0f-1f812313867c",
    "email": "example@demo.com",
    "name": "Shodh AI",
    "goal": "Score 105 in TOFEL",
    "feeling": "Nervous",
    "confidence": "Is Confident",
    "createdAt": "2025-06-14T10:52:23.000Z"
  }
  ```

### Add User Details

- **URL:** `/user/fill-details`
- **Method:** POST
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "name": "Shodh AI",
    "goal": "Score 105 in TOFEL",
    "feeling": "Nervous",
    "confidence": "Is Confident"
  }
  ```
- **Example Response (200 OK):**
  ```json
  {
    "message": "User details updated successfully",
    "user": {
      "id": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "name": "Shodh AI",
      "goal": "Score 105 in TOFEL",
      "feeling": "Nervous",
      "confidence": "Is Confident"
    }
  }
  ```

### Add User Flow

- **URL:** `/user/add-flow`
- **Method:** POST
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "flowElements": [
      {
        "type": "speaking",
        "level": "easy",
        "topic": "Hobbies",
        "task": "Describe your favorite hobby.",
        "order": 1
      },
      {
        "type": "writing",
        "level": "medium",
        "topic": "Travel",
        "task": "Write a short paragraph about your dream vacation.",
        "order": 2
      }
    ]
  }
  ```
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "message": "Flow added successfully",
    "flow": {
      "id": "generated-flow-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "flowElements": [
        {
          "id": "element1-id",
          "type": "speaking",
          "level": "easy",
          "topic": "Hobbies",
          "task": "Describe your favorite hobby.",
          "order": 1
        },
        {
          "id": "element2-id",
          "type": "writing",
          "level": "medium",
          "topic": "Travel",
          "task": "Write a short paragraph about your dream vacation.",
          "order": 2
        }
      ]
    }
  }
  ```

### Get User Flow

- **URL:** `/user/get-flow`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "id": "generated-flow-id",
    "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
    "currentOrder": 1,
    "flowElements": [
      {
        "id": "element1-id",
        "type": "speaking",
        "level": "easy",
        "topic": "Hobbies",
        "task": "Describe your favorite hobby.",
        "order": 1
      },
      {
        "id": "element2-id",
        "type": "writing",
        "level": "medium",
        "topic": "Travel",
        "task": "Write a short paragraph about your dream vacation.",
        "order": 2
      }
    ]
  }
  ```

### Show Next Flow Element

- **URL:** `/user/get-next-flow`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "currentFlowElement": {
      "id": "element1-id",
      "type": "speaking",
      "level": "easy",
      "topic": "Hobbies",
      "task": "Describe your favorite hobby.",
      "order": 1
    },
    "nextOrder": 2
  }
  ```

### Add Report

- **URL:** `/user/add-report`
- **Method:** POST
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "flowId": "flow-element-id-from-get-flow",
    "userText": "This is a sample text for the report.",
    "mainComment": "This is the main comment on the overall text",
    "comments": [
      {
        "startIndex": 0,
        "endIndex": 4,
        "wrongText": "This",
        "rightText": "That",
        "info": "'This' should be 'That' for grammatical reasons."
      },
      {
        "startIndex": 10,
        "endIndex": 16,
        "wrongText": "sample",
        "rightText": "example",
        "info": "'Sample' can be replaced with 'example' for better context."
      }
    ]
  }
  ```
- **Example Response (201 Created):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "message": "Report added successfully",
    "report": {
      "id": "generated-report-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "flowId": "flow-element-id-from-get-flow",
      "userText": "This is a sample text for the report.",
      "mainComment": "This is the main comment on the overall text",
      "date": "2025-06-14T12:00:00.000Z",
      "comments": [
        {
          "id": "comment1-id",
          "startIndex": 0,
          "endIndex": 4,
          "wrongText": "This",
          "rightText": "That",
          "info": "'This' should be 'That' for grammatical reasons."
        },
        {
          "id": "comment2-id",
          "startIndex": 10,
          "endIndex": 16,
          "wrongText": "sample",
          "rightText": "example",
          "info": "'Sample' can be replaced with 'example' for better context."
        }
      ]
    }
  }
  ```

### Get Reports

- **URL:** `/user/get-reports`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  [
    {
      "id": "report1-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "flowId": "flow-element1-id",
      "userText": "User submission text for report 1.",
      "mainComment": "Overall feedback for report 1.",
      "date": "2025-06-13T10:00:00.000Z",
      "comments": []
    },
    {
      "id": "report2-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "flowId": "flow-element2-id",
      "userText": "User submission text for report 2.",
      "mainComment": "Overall feedback for report 2.",
      "date": "2025-06-14T11:00:00.000Z",
      "comments": []
    }
  ]
  ```

### Get Report By ID

- **URL:** `/user/get-report-by-id?id={reportId}`
- **Method:** GET
- **Auth:** Bearer Token
- **Query Parameters:**
  - `id` (string, required): The ID of the report to retrieve.
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "id": "requested-report-id",
    "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
    "flowId": "flow-element-id",
    "userText": "User submission text for the report.",
    "mainComment": "Overall feedback for the report.",
    "date": "2025-06-14T12:00:00.000Z",
    "comments": [
      {
        "id": "comment1-id",
        "startIndex": 0,
        "endIndex": 4,
        "wrongText": "This",
        "rightText": "That",
        "info": "..."
      },
      {
        "id": "comment2-id",
        "startIndex": 10,
        "endIndex": 16,
        "wrongText": "sample",
        "rightText": "example",
        "info": "..."
      }
    ]
  }
  ```

### Add Note

- **URL:** `/user/add-note`
- **Method:** POST
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "heading": "My New Note",
    "content": "This is the content of my new note."
  }
  ```
- **Example Response (201 Created):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "message": "Note added successfully",
    "note": {
      "id": "generated-note-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "heading": "My New Note",
      "content": "This is the content of my new note.",
      "date": "2025-06-14T14:30:00.000Z"
    }
  }
  ```

### Get Notes

- **URL:** `/user/get-notes`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  [
    {
      "id": "note1-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "heading": "First Note",
      "content": "Content of the first note.",
      "date": "2025-06-13T09:00:00.000Z"
    },
    {
      "id": "note2-id",
      "userId": "b8e76870-532e-4f9f-bb0f-1f812313867c",
      "heading": "Second Note",
      "content": "Content of the second note.",
      "date": "2025-06-14T10:30:00.000Z"
    }
  ]
  ```

### Get User Words

- **URL:** `/user/get-user-words`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  [
    {
      "id": "word1-id",
      "word": "Ephemeral",
      "meaning": "Lasting for a very short time.",
      "example": "The beauty of the cherry blossoms is ephemeral.",
      "dateLearned": "2025-06-10T15:00:00.000Z"
    },
    {
      "id": "word2-id",
      "word": "Ubiquitous",
      "meaning": "Present, appearing, or found everywhere.",
      "example": "Smartphones have become ubiquitous in modern society.",
      "dateLearned": "2025-06-12T11:00:00.000Z"
    }
  ]
  ```

### Learn New Word

- **URL:** `/user/learn-new-word`
- **Method:** GET
- **Auth:** Bearer Token
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation - this assumes it returns a word for the user to learn)
  ```json
  {
    "id": "new-word-id",
    "word": "Serendipity",
    "meaning": "The occurrence and development of events by chance in a happy or beneficial way.",
    "example": "Discovering the old bookstore was a serendipitous find."
  }
  ```

---

## Words

### Add Word

- **URL:** `/word/add`
- **Method:** POST
- **Body:**
  ```json
  {
    "word": "Ephemeral",
    "meaning": "Lasting for a very short time.",
    "example": "The beauty of the cherry blossoms is ephemeral."
  }
  ```
- **Example Response (201 Created):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "message": "Word added successfully",
    "word": {
      "id": "generated-word-id",
      "word": "Ephemeral",
      "meaning": "Lasting for a very short time.",
      "example": "The beauty of the cherry blossoms is ephemeral.",
      "date": "2025-06-14T16:00:00.000Z"
    }
  }
  ```

### Get All Words

- **URL:** `/word/all`
- **Method:** GET
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  [
    {
      "id": "word1-id",
      "word": "Ephemeral",
      "meaning": "Lasting for a very short time.",
      "example": "The beauty of the cherry blossoms is ephemeral.",
      "date": "2025-06-10T15:00:00.000Z"
    },
    {
      "id": "word2-id",
      "word": "Ubiquitous",
      "meaning": "Present, appearing, or found everywhere.",
      "example": "Smartphones have become ubiquitous in modern society.",
      "date": "2025-06-12T11:00:00.000Z"
    }
  ]
  ```

### Delete Word

- **URL:** `/word/delete`
- **Method:** DELETE
- **Body:**
  ```json
  {
    "word": "Ephemeral"
  }
  ```
- **Example Response (200 OK):** (Note: Actual response structure depends on your implementation)
  ```json
  {
    "message": "Word 'Ephemeral' deleted successfully"
  }
  ```
