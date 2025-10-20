import json
import hashlib
import os
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate FreeKassa payment link for traffic fines
    Args: event - dict with httpMethod, body (amount, drivers_license, vehicle_registration)
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
    
    merchant_id = '66622'
    secret_word = '*Xy{Q(l1ROi*3!n'
    
    amount = str(body_data.get('amount', 80000))
    currency = 'RUB'
    order_id = body_data.get('order_id', context.request_id)
    
    drivers_license = body_data.get('drivers_license', '')
    vehicle_registration = body_data.get('vehicle_registration', '')
    
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
            'amount': float(amount),
            'drivers_license': drivers_license,
            'vehicle_registration': vehicle_registration
        }),
        'isBase64Encoded': False
    }
