import uuid
import random

from flask import (Blueprint, request)
from . import cache
from . import constants


# Define blueprint instance and define configuration for routes defined below
blueprint = Blueprint('messages', __name__, url_prefix='/api/messages')


# Define cache instance that allows for asynchronous reads and writes
cache = cache.AsynchronousCache()


@blueprint.route('/', methods=['POST'])
async def get_answer():
    if request.method == 'POST':
        request_data = request.json

        # Validate received data to make sure that:
        #   - message field is present
        #   - message field is a string
        if ('message' not in request_data
                or not isinstance(request_data['message'], str)):
            return 'Message is required and must be a string\n', 400

        request_message = request_data['message']

        # Ensure received message is within length limits
        if (len(request_message) < constants.MINIMUM_MESSAGE_LENGTH
                or len(request_message) > constants.MAXIMUM_MESSAGE_LENGTH):
            return (f"Message length must be between "
                    f"{constants.MINIMUM_MESSAGE_LENGTH} and "
                    f"{constants.MAXIMUM_MESSAGE_LENGTH} characters\n"), 400

        # Check whether we have the message's answer already in chace:
        #   - If yes, we simply return the cached answer
        #   - If not, we cache the newly generated answer and return it
        request_answer = await cache.get_or_set(
            request_message, "Hello, world! This is a hard-coded answer."
        )

        return {'answer_id': uuid.uuid4(), 'answer': request_answer}


@blueprint.route('/<answer_id>/sources', methods=['GET'])
def get_answer_sources(answer_id):
    if request.method == 'GET':
        # Given an answer_id, return random number of sources for that answer
        sources_num = random.randint(1, len(constants.FACT_CHECKING_SOURCES))
        sources = random.sample(constants.FACT_CHECKING_SOURCES, sources_num)

        return {'answer_id': answer_id, 'answer_sources': sources}
