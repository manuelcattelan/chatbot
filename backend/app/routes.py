import uuid
import random

from flask import (Blueprint, request, current_app)

from . import cache
from . import constants
from . import attachments


blueprint = Blueprint('messages', __name__, url_prefix='/api/messages')
cache = cache.AsynchronousCache()


@blueprint.route('', methods=['POST'])
async def get_answer():
    if request.method == 'POST':
        request_message = request.form.get('message')

        if (request_message is None
                or not isinstance(request_message, str)):
            current_app.logger.error(
                'validation error: message is required and must be a string')

            response_status_code = 400
            response_message = 'Message is required and must be a string.\n'
            return {
                'status': 'error',
                'status_code': response_status_code,
                'message': response_message
            }, response_status_code

        if (len(request_message) < constants.MINIMUM_MESSAGE_LENGTH
                or len(request_message) > constants.MAXIMUM_MESSAGE_LENGTH):
            current_app.logger.error(
                'validation error: message length out of bounds')

            response_status_code = 400
            response_message = (f'Message length must be between '
                                f'{constants.MINIMUM_MESSAGE_LENGTH} and '
                                f'{constants.MAXIMUM_MESSAGE_LENGTH} characters.\n')
            return {
                'status': 'error',
                'status_code': response_status_code,
                'message': response_message
            }, response_status_code

        if 'attachment' in request.files:
            request_attachment = request.files['attachment']

            try:
                if request_attachment \
                        and attachments.is_allowed(request_attachment.filename):
                    request_attachment_path = attachments.save(
                        request_attachment)

                    request_answer = attachments.get_content_portion(
                        request_attachment_path)

                    return {
                        'status': 'success',
                        'data': {
                            'answer_id': uuid.uuid4(),
                            'answer': request_answer
                        }
                    }
            except Exception as e:
                current_app.logger.error(
                    f'failed to get content portion for attachment: {str(e)}')

                response_status_code = 500
                response_message = 'Failed to get content portion for attachment.'
                return {
                    'status': 'error',
                    'status_code': response_status_code,
                    'message': response_message
                }, response_status_code

        try:
            request_answer = await cache.get_or_set(
                request_message, "Hello, world! This is a hard-coded answer."
            )
        except Exception as e:
            current_app.logger.error(
                f'failed to get answer for message `{request_message}`: '
                f'{str(e)}')

            response_status_code = 500
            response_message = 'Failed to get answer.'
            return {
                'status': 'error',
                'status_code': response_status_code,
                'message': response_message
            }, response_status_code

        return {
            'status': 'success',
            'data': {
                'answer_id': uuid.uuid4(),
                'answer': request_answer
            }
        }


@blueprint.route('/<answer_id>/sources', methods=['GET'])
def get_answer_sources(answer_id):
    if request.method == 'GET':
        # This try-except is not needed since fact-checking sources are
        # mocked and generated by a pseudo-random function.
        # In a real-world scenario, this would include real application logic,
        # thus requiring some kind of error handling.
        try:
            sources_num = random.randint(
                0, len(constants.FACT_CHECKING_SOURCES))
            sources = random.sample(
                constants.FACT_CHECKING_SOURCES, sources_num)
        except Exception as e:
            current_app.logger.error(
                f'failed to get sources for answer `{answer_id}`: {str(e)}')

            response_status_code = 500
            response_message = 'Failed to get sources for the requested answer.'
            return {
                'status': 'error',
                'status_code': response_status_code,
                'message': response_message
            }, response_status_code

        return {
            'status': 'success',
            'data': {
                'answer_id': answer_id,
                'answer_sources': sources
            }
        }
