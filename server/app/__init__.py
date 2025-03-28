from flask import Flask
from flask_cors import CORS

from . import app
from . import constants


def create_app():
    flask = Flask(__name__)
    flask.register_blueprint(app.blueprint)

    flask.config['ATTACHMENTS_FOLDER'] = constants.ATTACHMENTS_FOLDER
    flask.config['MAX_CONTENT_LENGTH'] = constants.MAX_CONTENT_LENGTH

    CORS(flask)

    return flask
