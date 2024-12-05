import base64
import json

def token_decoder(token):

    header, payload, signature = token.split('.')

    decoded_header = json.loads(base64.urlsafe_b64decode(header + "==").decode("utf-8"))
    decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode("utf-8"))

    return [decoded_header, decoded_payload]
