# backend/routers/api/creationRoom.py
from aiohttp import web
import asyncpg
import secrets
import re

from utils import check_valid, hash_password

async def handler(request):
  data = await request.json()
  name = data.get('name')
  type_room = data.get('typeroom')
  token = request.cookies.get('token')
  
  errors = {}
  
  is_valid_name = check_valid(name.strip(), 3, 64, r'^[A-Za-z0-9_]+$', 'name')
  
  for field in [is_valid_name]:
    if not field['valid']:
      errors[field['field']] = field
      
  if errors:
    return web.json_response({"ok": False, 'errors': errors})
    
  if type_room not in ('public', 'private'):
    type_room = 'public'
  
  async with request.app['pool'].acquire() as conn:
    row = await conn.fetchrow("SELECT name FROM rooms WHERE name = $1", name.strip())
    
  if row:
    errors['name'] = {'valid': False, 'field': 'name', 'cause': 'EXISTS'}
    return web.json_response({"ok": False, 'errors': errors})
    
  async with request.app['pool'].acquire() as conn:
    user_id = await conn.fetchrow("SELECT user_id FROM sessions WHERE token = $1", token)
    
  if type_room == 'public':
    async with request.app['pool'].acquire() as conn:
      await conn.execute("INSERT INTO rooms (user_id, name, type) VALUES($1, $2, $3)", user_id["user_id"], name.strip(), type_room)
      
    return web.json_response({"ok": True, "typeroom": "public"})
  else:
    invite_code = secrets.token_hex(4).upper()
    beautiful_invite_code = invite_code[:4] + "-" + invite_code[4:]
    hashed_invite_code = (await hash_password(beautiful_invite_code.strip())).decode()
    
    async with request.app['pool'].acquire() as conn:
      await conn.execute("INSERT INTO rooms (user_id, name, type, invite_code) VALUES($1, $2, $3, $4)", user_id["user_id"], name.strip(), type_room, hashed_invite_code)
      
    return web.json_response({"ok": True, "typeroom": "private", "invitecode": beautiful_invite_code})
      
    