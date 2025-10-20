import json
import hashlib
import os
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate FreeKassa payment link via SCI (Shop Cart Interface)
    Args: event - dict with httpMethod, body (amount, order_id, currency, email)
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
    
    amount = str(body_data.get('amount', 500))
    currency = body_data.get('currency', 'RUB')
    order_id = body_data.get('order_id', context.request_id)
    email = body_data.get('email', '')
    phone = body_data.get('phone', '')
    
    signature_string = f"{merchant_id}:{amount}:{secret_word}:{currency}:{order_id}"
    signature = hashlib.md5(signature_string.encode()).hexdigest()
    
    params = {
        'm': merchant_id,
        'oa': amount,
        'currency': currency,
        'o': order_id,
        's': signature,
        'lang': 'ru'
    }
    
    if email:
        params['em'] = email
    
    if phone:
        params['phone'] = phone
    
    payment_url = f"https://pay.fk.money/?{urllib.parse.urlencode(params)}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'payment_url': payment_url,
            'order_id': order_id,
            'amount': float(amount)
        }),
        'isBase64Encoded': False
    }