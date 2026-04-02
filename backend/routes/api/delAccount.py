# backend/routers/api/delAccount.py
from aiohttp import web
import asyncpg
import pathlib

async def handler(request):
  token = request.cookies.get('token')
  
  response = web.json_response({"ok": True})
  response.del_cookie('token', path='/')
  
  if not token:
    return response
    
  async with request.app['pool'].acquire() as conn:
    row = await conn.fetchrow("SELECT token, user_id FROM sessions WHERE token = $1", token)
    if not row:
      return response
    await conn.execute("DELETE FROM users WHERE id = $1", row['user_id'])
    
  return response