# backend/utils.py
from datetime import datetime, timezone, timedelta
from aiohttp import web
import asyncio
import bcrypt
import re

def check_valid(data, minLen, maxLen, pattern, field):
  if not data:
    return {'valid': False, 'field': field, 'cause': 'EMPTY'}
  elif len(data) < minLen:
    return {'valid': False, 'field': field, 'cause': 'TOO_SHORT'}
  elif len(data) > maxLen:
    return {'valid': False, 'field': field, 'cause': 'TOO_LONG'}
  elif pattern and not re.match(pattern, data):
    return {'valid': False, 'field': field, 'cause': 'INVALID_PATTERN'}
  else:
    return {'valid': True, 'field': field}
    
    
async def hash_password(password):
  byte_password = password.encode()
  hashed = await asyncio.to_thread(
    bcrypt.hashpw, byte_password, bcrypt.gensalt()
  )
  return hashed
  
  
async def check_password(password_user, password_db):
  password_user_bytes = password_user.encode('utf-8')
  password_db_bytes = password_db.encode('utf-8')
  
  if await asyncio.to_thread(bcrypt.checkpw, password_user_bytes, password_db_bytes):
    return True
  return False


async def created_session(request, nick, token):
  async with request.app['pool'].acquire() as conn:
    user_id = await conn.fetchrow("SELECT id FROM users WHERE nick = $1", nick.strip())
    await conn.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES($1, $2, $3)", token, user_id['id'], datetime.now(timezone.utc) + timedelta(hours=24))


async def del_expired_sessions(app):
  async with app['pool'].acquire() as conn:
    await conn.execute("DELETE FROM sessions WHERE expires_at < $1", datetime.now(timezone.utc))
    