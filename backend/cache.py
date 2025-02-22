import json
import redis
from datetime import datetime
from config import REDIS_URL, REDIS_TIMEOUT, CACHE_KEY, CACHE_EXPIRY
from classroom_availability import get_classroom_availability

rd = redis.from_url(
    REDIS_URL,
    decode_responses=True,
    socket_timeout=REDIS_TIMEOUT
)

async def update_cache():
    print(f'Starting cache update at {datetime.now()}')
    
    try:
        availability_data = await get_classroom_availability()
        rd.set(CACHE_KEY, json.dumps(availability_data), ex=CACHE_EXPIRY)
        print('Cache update completed successfully')
    except redis.RedisError as e:
        print(f'Redis operation failed: {str(e)}')
    except Exception as e:
        print(f'Cache update failed: {str(e)}')