# backend/routers/api/creationRoom.py
from aiohttp import web
import asyncpg

async def handler(request):
  data = await request.json()
      
  return web.json_response({"ok": True})