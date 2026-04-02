# backend/routers/api/exitAccount.py
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
    await conn.execute("DELETE FROM sessions WHERE token = $1", token)
  
  return response