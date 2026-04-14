# backend/routers/api/searchRoom.py
from aiohttp import web
import asyncpg

async def handler(request):
  data = await request.json()
  search = data.get('search')
  
  if not search:
    return web.json_response({"ok": False})
  
  async with request.app['pool'].acquire() as conn:
    search_results  = await conn.fetch("SELECT room_id, name, type FROM rooms WHERE name % $1", search.strip())
  
  formatted_search_results = [dict(search_result) for search_result in search_results]
    
  return web.json_response({"ok": True, 'result': formatted_search_results})
