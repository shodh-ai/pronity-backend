import os
import json
import argparse
import sys
from typing import Dict, Any, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes and all origins
CORS(app)

# Get the OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("ERROR: OPENAI_API_KEY environment variable not set")
    print("Please set it in the .env file or as an environment variable")
    # Don't exit - we'll handle this in the functions instead

def generate_speaking_task(topic: str) -> Dict[str, Any]:
    """
    Generate a TOEFL speaking task based on the given topic using OpenAI
    
    Args:
        topic: The topic for the speaking task
        
    Returns:
        Dictionary containing the generated task
    """
    try:
        # Check if API key is available
        if not api_key:
            raise ValueError("OpenAI API key is not set. Check your .env file.")
            
        # Construct a prompt for GPT to generate a TOEFL speaking task
        prompt = f"""
        Create a TOEFL independent speaking task about "{topic}".
        
        The task should:
        1. Include a clear question about {topic}
        2. Ask the student to express and support their opinion
        3. Be appropriate for a 45-second response
        4. Be challenging but manageable for an intermediate to advanced English learner
        
        Format the response as JSON with these fields:
        - taskTitle: A brief title for the task
        - taskDescription: The full text of the speaking prompt
        - suggestedPoints: 2-3 points the student could address
        - difficultyLevel: A number from 1-5 (1=easiest, 5=hardest)
        """
        
        print(f"Generating speaking task for topic: {topic}")
        print(f"Using model: gpt-4o-mini")
        
        # Call OpenAI API directly with requests
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        data = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a TOEFL test preparation expert."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Extract and parse the response
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
        print(f"Raw API response: {content[:100]}...")
        
        task_data = json.loads(content)
        
        # Add the original topic to the response
        task_data["topic"] = topic
        
        return task_data
    
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print(f"Raw response was: {content if 'content' in locals() else 'No content received'}")
        return {
            "taskTitle": f"Speaking about {topic}",
            "taskDescription": f"Talk about your experience or opinion regarding {topic}. Provide specific examples to support your answer.",
            "suggestedPoints": ["Personal experience", "Specific examples", "Your opinion"],
            "difficultyLevel": 3,
            "topic": topic,
            "error": f"JSON parsing error: {str(e)}"
        }
    except Exception as e:
        print(f"Error generating speaking task: {e}")
        error_type = type(e).__name__
        # Return a basic fallback task if API call fails
        return {
            "taskTitle": f"Speaking about {topic}",
            "taskDescription": f"Talk about your experience or opinion regarding {topic}. Provide specific examples to support your answer.",
            "suggestedPoints": ["Personal experience", "Specific examples", "Your opinion"],
            "difficultyLevel": 3,
            "topic": topic,
            "error": f"{error_type}: {str(e)}"
        }

def generate_writing_task(topic: str) -> Dict[str, Any]:
    """
    Generate a TOEFL writing task based on the given topic using OpenAI
    
    Args:
        topic: The topic for the writing task
        
    Returns:
        Dictionary containing the generated task
    """
    try:
        # Check if API key is available
        if not api_key:
            raise ValueError("OpenAI API key is not set. Check your .env file.")
            
        # Construct a prompt for GPT to generate a TOEFL writing task
        prompt = f"""
        Create a TOEFL independent writing task about "{topic}".
        
        The task should:
        1. Include a clear writing prompt about {topic}
        2. Ask the student to express and support their opinion with reasons and examples
        3. Be appropriate for a 30-minute response (300-350 words)
        4. Be challenging but manageable for an intermediate to advanced English learner
        
        Format the response as JSON with these fields:
        - taskTitle: A brief title for the task
        - taskDescription: The full text of the writing prompt
        - suggestedPoints: 2-3 points the student could address
        - difficultyLevel: A number from 1-5 (1=easiest, 5=hardest)
        """
        
        print(f"Generating writing task for topic: {topic}")
        print(f"Using model: gpt-4o-mini")
        
        # Call OpenAI API directly with requests
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        data = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a TOEFL test preparation expert."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Extract and parse the response
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
        print(f"Raw API response: {content[:100]}...")
        
        task_data = json.loads(content)
        
        # Add the original topic to the response
        task_data["topic"] = topic
        
        return task_data
    
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print(f"Raw response was: {content if 'content' in locals() else 'No content received'}")
        return {
            "taskTitle": f"Writing about {topic}",
            "taskDescription": f"Write an essay discussing your views on {topic}. Support your opinion with specific reasons and examples.",
            "suggestedPoints": ["Introduction with thesis", "Supporting arguments", "Conclusion"],
            "difficultyLevel": 3,
            "topic": topic,
            "error": f"JSON parsing error: {str(e)}"
        }
    except Exception as e:
        print(f"Error generating writing task: {e}")
        error_type = type(e).__name__
        # Return a basic fallback task if API call fails
        return {
            "taskTitle": f"Writing about {topic}",
            "taskDescription": f"Write an essay discussing your views on {topic}. Support your opinion with specific reasons and examples.",
            "suggestedPoints": ["Introduction with thesis", "Supporting arguments", "Conclusion"],
            "difficultyLevel": 3,
            "topic": topic,
            "error": f"{error_type}: {str(e)}"
        }

@app.route('/generate-task', methods=['POST'])
def generate_task():
    """API endpoint to generate a task based on a topic"""
    data = request.json
    
    if not data or 'topic' not in data:
        return jsonify({"error": "Missing topic in request body"}), 400
    
    task_type = data.get('taskType', 'speaking')  # Default to speaking if not specified
    topic = data['topic']
    
    if task_type == 'speaking':
        task_data = generate_speaking_task(topic)
    elif task_type == 'writing':
        task_data = generate_writing_task(topic)
    else:
        return jsonify({"error": f"Unsupported task type: {task_type}"}), 400
    
    return jsonify(task_data)

if __name__ == "__main__":
    import sys
    
    # Check if we're being run as a script with arguments
    if len(sys.argv) > 1:
        # For command line use
        parser = argparse.ArgumentParser(description="Generate TOEFL speaking or writing tasks")
        parser.add_argument("--topic", required=True, help="Topic for the task")
        parser.add_argument("--type", default="speaking", choices=["speaking", "writing"], 
                            help="Type of task to generate")
        args = parser.parse_args()
        
        if args.type == "speaking":
            result = generate_speaking_task(args.topic)
        else:
            result = generate_writing_task(args.topic)
        
        print(json.dumps(result, indent=2))
    else:
        # Start the Flask server
        host = os.getenv("HOST", "0.0.0.0")
        port = int(os.getenv("PORT", 5001))
        debug = os.getenv("DEBUG", "False").lower() == "true"
        
        print(f"\n===== Task Generation Service =====")
        print(f"Starting Flask server at http://{host}:{port}")
        print(f"OpenAI API Key: {'Set' if api_key else 'NOT SET - service will not work properly'}")
        print(f"Debug mode: {debug}")
        print(f"==============================\n")
        
        app.run(host=host, port=port, debug=debug)
