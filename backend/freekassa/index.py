import json
import hashlib
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate FreeKassa payment link with signature
    Args: event - dict with httpMethod, body (amount, order_id, email)
          context - object with request_id
    Returns: HTTP response with payment URL
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    merchant_id = os.environ.get('FREEKASSA_MERCHANT_ID')
    secret_word = os.environ.get('FREEKASSA_SECRET_WORD_1')
    
    if not merchant_id or not secret_word:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'FreeKassa credentials not configured'}),
            'isBase64Encoded': False
        }
    
    amount = body_data.get('amount', 500)
    order_id = body_data.get('order_id', context.request_id)
    email = body_data.get('email', '')
    drivers_license = body_data.get('drivers_license', '')
    vehicle_registration = body_data.get('vehicle_registration', '')
    
    signature_string = f"{merchant_id}:{amount}:{secret_word}:{order_id}"
    signature = hashlib.md5(signature_string.encode()).hexdigest()
    
    payment_url = f"https://pay.freekassa.ru/?m={merchant_id}&oa={amount}&o={order_id}&s={signature}"
    
    if email:
        payment_url += f"&em={email}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'payment_url': payment_url,
            'order_id': order_id,
            'amount': amount
        }),
        'isBase64Encoded': False
    }
