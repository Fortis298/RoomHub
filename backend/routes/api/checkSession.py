# backend/routers/api/checkSession.py
from aiohttp import web
import asyncpg

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
    user_rooms = await conn.fetch("SELECT room_id, name, type FROM rooms WHERE user_id = $1", row['user_id'])
    
  if not user_info:
    return web.json_response({"ok": False})
    
  formatted_user_room = [dict(user_room) for user_room in user_rooms]
  
  info = {
    'nick': user_info['nick'],
    'id': row['user_id'],
    'created_at': user_info['created_at'].strftime("%Y-%m-%d"),
  }
      
  return web.json_response({"ok": True, 'info': info, 'room': formatted_user_room})