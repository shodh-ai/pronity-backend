import os
from dotenv import load_dotenv
from task_generator import app

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    print(f"Starting task generation service on {host}:{port}")
    app.run(host=host, port=port, debug=debug)
