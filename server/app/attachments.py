import os
import random

from flask import current_app
from werkzeug.utils import secure_filename
from pypdf import PdfReader

from . import constants


def is_allowed(attachment_filename):
    if '.' not in attachment_filename:
        return False
    attachment_extension = attachment_filename.rsplit('.', 1)[1].lower()
    return attachment_extension == constants.ATTACHMENTS_ALLOWED_EXTENSION


def save(attachment):
    os.makedirs(current_app.config['ATTACHMENTS_FOLDER'], exist_ok=True)

    attachment_filename = secure_filename(attachment.filename)
    attachment_filepath = os.path.join(
        current_app.config['ATTACHMENTS_FOLDER'], attachment_filename)
    attachment.save(attachment_filepath)

    return attachment_filepath


def get_content_portion(attachment_path):
    with open(attachment_path, 'rb') as attachment_file:
        attachment_reader = PdfReader(attachment_file)
        attachment_content = ""

        for attachment_page in attachment_reader.pages:
            attachment_content += attachment_page.extract_text()
        attachment_content = ' '.join(attachment_content.split())

        portion_length = random.randint(1, len(attachment_content))
        portion_start = random.randint(
            0, len(attachment_content) - portion_length)

        return attachment_content[portion_start:portion_start + portion_length]
