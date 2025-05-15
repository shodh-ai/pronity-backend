# Task Generation Service

This service generates TOEFL-style speaking and writing tasks based on topic input. It uses OpenAI's API to create high-quality, contextually relevant practice tasks.

## Setup

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a `.env` file based on the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Service

Start the service with:
```bash
python server.py
```

The service will start on port 5001 by default.

## API Endpoints

### Generate Task

**Endpoint:** `POST /generate-task`

**Request Body:**
```json
{
  "topic": "technology",
  "taskType": "speaking"  // or "writing"
}
```

**Response:**
```json
{
  "taskTitle": "Technology's Impact on Society",
  "taskDescription": "Describe how technology has affected daily life. Do you think modern technology has had a more positive or negative impact on society? Support your answer with specific examples.",
  "suggestedPoints": [
    "Personal experience with technology",
    "Benefits of technology",
    "Drawbacks or challenges"
  ],
  "difficultyLevel": 3,
  "topic": "technology"
}
```

## Command Line Usage

You can also use the script directly from the command line:

```bash
python task_generator.py --topic "technology" --type "speaking"
```

This will output the generated task in JSON format.
