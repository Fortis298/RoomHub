# backend/app.py
from aiohttp import web
import asyncpg
import pathlib
import asyncio
import logging
import os

from routes.api import (
  signUp, 
  logIn, 
  checkSession, 
  exitAccount, 
  delAccount, 
  creationRoom,
  delRoom,
  searchRoom
)
from routes.pages import signUpPage, logInPage, homePage

from utils import del_expired_sessions

app = web.Application()
BASE_DIR = pathlib.Path(__file__).parent.parent / "frontend"

logging.basicConfig(
  level=logging.INFO,
  format='%(asctime)s | %(levelname)s | %(name)s | %(message)s',
)

logger = logging.getLogger(__name__)
db = os.getenv('db')

async def task(app):
  while True:
    try:
      await del_expired_sessions(app)
      await asyncio.sleep(300)
    except Exception as e:
      logger.error("Не удавалось выполнить задачу")

async def startup(app):
  pool = await asyncpg.create_pool(db)
  app['pool'] = pool
  app['task'] = asyncio.create_task(task(app))
  
async def cleanup(app):
  pool = app["pool"]
  await pool.close()
  task = app.get('task')
  if task:
    task.cancel()
    
app.on_startup.append(startup)
app.on_cleanup.append(cleanup)

app.router.add_static("/static/common", path=BASE_DIR / "common")
app.router.add_static("/static/signUp", path=BASE_DIR / "signUp")
app.router.add_static("/static/logIn", path=BASE_DIR / "logIn")
app.router.add_static("/static/home", path=BASE_DIR / "home")
app.router.add_static("/static/home/js", path=BASE_DIR / "home" / "js") 
app.router.add_static("/static/home/img", path=BASE_DIR / "home" / "img") 

app.router.add_post("/api/signUp", signUp.handler)
app.router.add_post("/api/logIn", logIn.handler)
app.router.add_post("/api/checkSession", checkSession.handler)
app.router.add_post("/api/exitAccount", exitAccount.handler)
app.router.add_post("/api/delAccount", delAccount.handler)
app.router.add_post("/api/creationRoom", creationRoom.handler)
app.router.add_post("/api/delRoom", delRoom.handler)
app.router.add_post("/api/searchRoom", searchRoom.handler)

app.router.add_get("/signUp", signUpPage.handler)
app.router.add_get("/logIn", logInPage.handler)
app.router.add_get("/home", homePage.handler)

app.router.add_get("/ping", lambda r: web.Response(text="ok"))

app.router.add_get("/robots.txt", lambda request: web.FileResponse(BASE_DIR / "robots.txt"))
app.router.add_get("/sitemap.xml", lambda request: web.FileResponse(BASE_DIR / "sitemap.xml"))
app.router.add_get("/google6391eacc14581c7a.html", lambda request: web.FileResponse(BASE_DIR / "google6391eacc14581c7a.html"))

web.run_app(app, host="127.0.0.1", port=8000)
#web.run_app(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))