# backend/routers/api/signUp.py
from aiohttp import web
import asyncpg
import secrets

from utils import check_valid, hash_password, created_session

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
      
  if row:
    errors['nick'] = {'valid': False, 'field': 'nick', 'cause': 'EXISTS'}
    return web.json_response({"ok": False, 'errors': errors})
    
  hashed = (await hash_password(password.strip())).decode()
  
  async with request.app['pool'].acquire() as conn:
    await conn.execute("INSERT INTO users (nick, password) VALUES($1, $2)", nick.strip(), hashed)
    
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