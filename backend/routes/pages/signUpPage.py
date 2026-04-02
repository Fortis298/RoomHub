# backend/routers/pages/signUpPage.py
from aiohttp import web
import aiofiles
import pathlib

BASE_DIR = pathlib.Path(__file__).parent.parent.parent.parent / "frontend"

async def handler(request):
  html_file = BASE_DIR / "signUp" / "index.html"
  async with aiofiles.open(html_file, mode='r', encoding='utf-8') as f:
    content = await f.read()
  return web.Response(text=content, content_type="text/html")