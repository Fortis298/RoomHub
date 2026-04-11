# backend/routers/api/delRoom.py
from aiohttp import web
import asyncpg

async def handler(request):
  data = await request.json()
  token = request.cookies.get('token')
  
  room_id = data.get('room_id')
  
  async with request.app['pool'].acquire() as conn:
    user_id = await conn.fetchrow("SELECT user_id FROM sessions WHERE token = $1", token)
  
  async with request.app['pool'].acquire() as conn:
    is_del_room = await conn.execute("DELETE FROM rooms WHERE user_id = $1 AND room_id = $2", int(user_id['user_id']), int(room_id))
    
  is_del_room = int(is_del_room[-1])
  
  if not is_del_room:
    return web.json_response({"ok": False})
    
  return web.json_response({"ok": True})
  
  