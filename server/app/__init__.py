from flask import Flask
from . import app


def create_app():
    flask = Flask(__name__)
    flask.register_blueprint(app.blueprint)

    return flask
