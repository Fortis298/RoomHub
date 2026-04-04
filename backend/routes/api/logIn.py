# backend/routers/api/signUp.py
from aiohttp import web
import asyncpg
import secrets

from utils import check_valid, check_password, created_session

async def handler(request):
  data = await request.json()
  nick = data.get('nick')
  password = data.get('password')
  
  errors = {}
  
  is_valid_nick = check_valid(nick, 3, 64, r'^[A-Za-z0-9_]+$', 'nick')
  is_valid_password = check_valid(password, 8, 64, r'', 'password')
  
  for field in [is_valid_nick, is_valid_password]:
    if not field['valid']:
      errors[field['field']] = field
  
  if errors:
    return web.json_response({"ok": False, 'errors': errors})
  
  async with request.app['pool'].acquire() as conn:
    row = await conn.fetchrow("SELECT nick FROM users WHERE nick = $1", nick.strip())
      
  if not row:
    errors['nick'] = {'valid': False, 'field': 'nick', 'cause': 'NOT_EXISTS'}
    return web.json_response({"ok": False, 'errors': errors})
  
  async with request.app['pool'].acquire() as conn:
    password_db = await conn.fetchrow("SELECT password FROM users WHERE nick = $1", nick.strip())
    
  is_valid_password_db = await check_password(password.strip(), password_db['password'])
  
  if not is_valid_password_db:
    errors['password'] = {'valid': False, 'field': 'password', 'cause': 'INVALID_PASSWORD'}
    return web.json_response({"ok": False, 'errors': errors})
    
  token = secrets.token_hex(32)
  
  await created_session(request, nick, token)
  
  response = web.json_response({"ok": True})
  response.set_cookie(
    'token',
    token,
    httponly=True,
    secure=True,
    samesite='Strict',
    max_age=24*3600
  )
  
  return response