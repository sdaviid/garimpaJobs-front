from flask import Flask


API_END_POINT = 'lalalalla'
# Initialize the app
app = Flask(__name__, instance_relative_config=True)

# Load the views
from app import views

# Load the config file
app.config.from_object('config')