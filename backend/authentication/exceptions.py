from rest_framework.views import exception_handler 

def status_code_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if 400 <= response.status_code < 500:
            response.status_code = 400 
        elif response.status_code >= 500:
            response.status_code = 500
    
    return response