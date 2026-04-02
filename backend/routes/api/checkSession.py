# backend/routers/api/checkSession.py
from datetime import datetime
from aiohttp import web
import asyncpg
import pathlib


async def handler(request):
  token = request.cookies.get('token')
  
  if not token:
    return web.json_response({"ok": False})
  
  async with request.app['pool'].acquire() as conn:
    row = await conn.fetchrow("SELECT token, user_id FROM sessions WHERE token = $1", token)
  
  if not row:
    return web.json_response({"ok": False})
  
  async with request.app['pool'].acquire() as conn:
    user_info = await conn.fetchrow("SELECT nick, created_at FROM users WHERE id = $1", row['user_id'])
    
  if not user_info:
    return web.json_response({"ok": False})
  
  info = {
    'nick': user_info['nick'],
    'id': row['user_id'],
    'created_at': user_info['created_at'].strftime("%Y-%m-%d")
  }
      
  return web.json_response({"ok": True, 'info': info})