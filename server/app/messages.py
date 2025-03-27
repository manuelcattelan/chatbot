import asyncio
from flask import (Blueprint, request)

blueprint = Blueprint('messages', __name__, url_prefix='/api/messages')


class AsynchronousCache:
    def __init__(self):
        self._cache = {}
        self._lock = asyncio.Lock()

    async def get(self, key):
        await asyncio.sleep(2)

        async with self._lock:
            return self._cache.get(key)

    async def set(self, key, value):
        await asyncio.sleep(2)

        async with self._lock:
            self._cache[key] = value


MINIMUM_MESSAGE_LENGTH = 1
MAXIMUM_MESSAGE_LENGTH = 1000
cache = AsynchronousCache()


@blueprint.route('/', methods=['POST'])
async def get_answer():
    if request.method == 'POST':
        request_data = request.json

        # Validate received data and make sure message is a string
        if ('message' not in request_data
                or not isinstance(request_data['message'], str)):
            return 'Message is required and must be a string\n', 400

        request_message = request_data['message']

        # Ensure received message is within length limits
        if (len(request_message) < MINIMUM_MESSAGE_LENGTH
                or len(request_message) > MAXIMUM_MESSAGE_LENGTH):
            return (f"Message length must be between "
                    f"{MINIMUM_MESSAGE_LENGTH} and "
                    f"{MAXIMUM_MESSAGE_LENGTH} characters\n"), 400

        request_answer = await cache.get(request_message)
        if request_answer is None:
            request_answer = "Hard-coded answer for message without attachment"
            await cache.set(request_message, request_answer)

        return request_answer


@blueprint.route('/<message_id>/sources', methods=['GET'])
def get_answer_sources(message_id):
    if request.method == 'GET':
        return f'/api/{message_id}/messages'
