from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi.middleware.cors import CORSMiddleware
import json

from cache import rd, update_cache
from classroom_availability import get_classroom_availability
from config import CACHE_EXPIRY, BUILDINGS, CLASSROOMS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

scheduler = AsyncIOScheduler()

@app.on_event('startup')
async def startup_event():
    try:
        scheduler.add_job(update_cache, 'cron', hour='0,12') # run at 12 AM and 12 PM
        scheduler.start()
        print('Scheduler started successfully')
    except Exception as e:
        print(f'Failed to start scheduler: {str(e)}')

@app.on_event('shutdown')
async def shutdown_event():
    try:
        scheduler.shutdown()
        print('Scheduler shut down successfully')
    except Exception as e:
        print(f'Failed to shutdown scheduler: {str(e)}')

@app.get('/')
async def root():
    return 'Hello World'

@app.get('/api/open-classrooms')
async def get_classroom_availability_by_building():
    try:
        # Check cache first
        cache = rd.get('classrooms:availability')
        
        if cache:
            print('Cache hit')
            availability_data = json.loads(cache)
        else:
            print('Cache miss - fetching new data')
            availability_data = await get_classroom_availability()
            rd.set('classrooms:availability', json.dumps(availability_data), ex=CACHE_EXPIRY)

        # Organize response by building
        res = {}
        for building_code, building_data in BUILDINGS.items():
            res[building_code] = {
                "code": building_data["code"],
                "name": building_data["name"],
                "classrooms": []
            }
        
        # Add classroom data to buildings
        for classroom_id, classroom_data in CLASSROOMS.items():
            building_code = classroom_data["building_code"]
            if building_code in res:
                res[building_code]["classrooms"].append({
                    "id": classroom_data["id"],
                    "name": classroom_data["name"],
                    "availability": availability_data.get(classroom_id, [])
                })
        
        return res

    except Exception as e:
        print(f'Error getting classroom availability: {str(e)}')
        return {}