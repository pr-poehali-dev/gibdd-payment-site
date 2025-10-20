import json
import os
import hmac
import hashlib
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create FreeKassa payment via new API v1
    Args: event - dict with httpMethod, body (amount, order_id, currency, email)
          context - object with request_id
    Returns: HTTP response with payment URL from FreeKassa API
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
    
    shop_id = os.environ.get('FREEKASSA_MERCHANT_ID')
    api_key = os.environ.get('FREEKASSA_API_KEY')
    
    if not shop_id or not api_key:
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
    
    nonce = str(hash(context.request_id))
    
    params = {
        'shopId': shop_id,
        'nonce': nonce,
        'amount': amount,
        'currency': currency,
        'orderId': order_id,
    }
    
    if email:
        params['email'] = email
    
    sorted_params = sorted(params.items())
    signature_string = '|'.join([str(v) for k, v in sorted_params])
    signature = hmac.new(
        api_key.encode(),
        signature_string.encode(),
        hashlib.sha256
    ).hexdigest()
    
    api_url = 'https://api.freekassa.net/v1/orders/create'
    
    request_data = {
        'shopId': shop_id,
        'nonce': nonce,
        'signature': signature,
        'amount': amount,
        'currency': currency,
        'orderId': order_id,
    }
    
    if email:
        request_data['email'] = email
    
    try:
        req = urllib.request.Request(
            api_url,
            data=json.dumps(request_data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            response_data = json.loads(response.read().decode('utf-8'))
            
            if response_data.get('type') == 'success':
                payment_url = response_data.get('location', '')
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
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': 'FreeKassa API error',
                        'details': response_data
                    }),
                    'isBase64Encoded': False
                }
                
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to create payment',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }