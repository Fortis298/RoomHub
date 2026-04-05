# backend/routers/api/creationRoom.py
from aiohttp import web
import asyncpg
import secrets
import re

from utils import check_valid, hash_password

async def handler(request):
  data = await request.json()
  name = data.get('name')
  typeRoom = data.get('typeroom')
  token = request.cookies.get('token')
  
  errors = {}
  
  is_valid_name = check_valid(name, 3, 64, r'^[A-Za-z0-9_]+$', 'name')
  
  for field in [is_valid_name]:
    if not field['valid']:
      errors[field['field']] = field
      
  if errors:
    return web.json_response({"ok": False, 'errors': errors})
    
  if not re.match(r'\b(public|private)\b', typeRoom):
    typeRoom = 'public'
  
  async with request.app['pool'].acquire() as conn:
    row = await conn.fetchrow("SELECT name FROM rooms WHERE name = $1", name.strip())
    
    if row:
      errors['name'] = {'valid': False, 'field': 'name', 'cause': 'EXISTS'}
      return web.json_response({"ok": False, 'errors': errors})
  
    user_id = await conn.fetchrow("SELECT user_id FROM sessions WHERE token = $1", token)
    
  
  
  
  
      
  return web.json_response({"ok": True})