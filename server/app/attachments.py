import os

from flask import current_app
from werkzeug.utils import secure_filename

from . import constants


def is_allowed(attachment_filename):
    if '.' not in attachment_filename:
        return False
    attachment_extension = attachment_filename.rsplit('.', 1)[1].lower()
    return attachment_extension == constants.ATTACHMENTS_ALLOWED_EXTENSION


def save(attachment):
    os.makedirs(current_app.config['ATTACHMENTS_FOLDER'], exist_ok=True)
    attachment_filename = secure_filename(attachment.filename)
    attachment.save(os.path.join(
        current_app.config['ATTACHMENTS_FOLDER'], attachment_filename))
