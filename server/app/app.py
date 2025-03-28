import uuid
import random

from flask import (Blueprint, request)

from . import cache
from . import constants
from . import attachments


blueprint = Blueprint('messages', __name__, url_prefix='/api/messages')
cache = cache.AsynchronousCache()


@blueprint.route('/', methods=['POST'])
async def get_answer():
    if request.method == 'POST':
        request_message = request.form.get('message')

        if (request_message is None
                or not isinstance(request_message, str)):
            return 'Message is required and must be a string\n', 400

        if (len(request_message) < constants.MINIMUM_MESSAGE_LENGTH
                or len(request_message) > constants.MAXIMUM_MESSAGE_LENGTH):
            return (f"Message length must be between "
                    f"{constants.MINIMUM_MESSAGE_LENGTH} and "
                    f"{constants.MAXIMUM_MESSAGE_LENGTH} characters\n"), 400

        if 'attachment' in request.files:
            request_attachment = request.files['attachment']
            if request_attachment \
                    and attachments.is_allowed(request_attachment.filename):
                attachments.save(request_attachment)

            return {'answer_id': uuid.uuid4(), 'answer': 'content'}

        request_answer = await cache.get_or_set(
            request_message, "Hello, world! This is a hard-coded answer."
        )

        return {'answer_id': uuid.uuid4(), 'answer': request_answer}


@blueprint.route('/<answer_id>/sources', methods=['GET'])
def get_answer_sources(answer_id):
    if request.method == 'GET':
        sources_num = random.randint(0, len(constants.FACT_CHECKING_SOURCES))
        sources = random.sample(constants.FACT_CHECKING_SOURCES, sources_num)

        return {'answer_id': answer_id, 'answer_sources': sources}
