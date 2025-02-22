import asyncio
import aiohttp
from datetime import datetime, timedelta
from config import API_URL, MIN_GAP_MINUTES, BUILDINGS, CLASSROOMS
import pytz

async def fetch_classroom_data(session, space_id, date):
    url = API_URL
    params = {
        'obj_cache_accl': 0,
        'start_dt': date.isoformat(),
        'comptype': 'availability_daily',
        'compsubject': 'location',
        'page_size': 100,
        'space_id': space_id,
        'include': 'closed blackouts pending related empty',
        'caller': 'pro-AvailService.getData'
    }
    
    try:
        async with session.get(url, params=params) as response:
            if response.status == 200:
                return await response.json()
            print(f'Failed to fetch data for space {space_id}: {response.status}')
            return None
    except Exception as e:
        print(f'Error fetching data for space {space_id}: {str(e)}')
        return None

def get_available_times(data, today_date, space_id):
    available_times = []
    
    # Find today's subject
    today_subject = None
    for subject in data['subjects']:
        if subject['item_date'].split('T')[0] == today_date.isoformat():
            today_subject = subject
            break
    
    if not today_subject:
        return available_times
    
    # Create reservation list
    reservations = []
    for item in today_subject['items']:
        try:
            start_hours = float(item['start'])
            end_hours = float(item['end'])
            
            start = datetime.combine(today_date, datetime.min.time()) + timedelta(hours=start_hours)
            end = datetime.combine(today_date, datetime.min.time()) + timedelta(hours=end_hours)
            
            reservations.append({'start': start, 'end': end})
        except Exception as e:
            print(f'Error processing reservation: {str(e)}')
    
    reservations.sort(key=lambda x: x['start'])
    
    # Get building hours
    building_code = CLASSROOMS[str(space_id)]["building_code"]
    business_start_hour = BUILDINGS[building_code]["business_start_hour"]
    business_end_hour = BUILDINGS[building_code]["business_end_hour"]
    
    business_start = datetime.combine(today_date, datetime.min.time()) + timedelta(hours=business_start_hour)
    business_end = datetime.combine(today_date, datetime.min.time()) + timedelta(hours=business_end_hour)
    
    current_time = business_start
    
    # Find available slots
    for reservation in reservations:
        if current_time < reservation['start'] and current_time < business_end:
            availability_end = business_end if reservation['start'] == business_end else min(
                reservation['start'] - timedelta(minutes=1),
                business_end
            )
            
            gap_minutes = (availability_end - current_time).total_seconds() / 60
            
            if gap_minutes > MIN_GAP_MINUTES and reservation['start'] > business_start:
                available_times.append({
                    'start': current_time,
                    'end': availability_end
                })
        current_time = max(current_time, reservation['end'] + timedelta(minutes=1))
    
    # Check final slot
    if current_time < business_end:
        final_gap_minutes = (business_end - current_time).total_seconds() / 60
        if final_gap_minutes > MIN_GAP_MINUTES:
            available_times.append({
                'start': current_time,
                'end': business_end
            })
    
    return available_times

async def get_classroom_availability():
    est = pytz.timezone('America/New_York')
    today_date = datetime.now(est).date()
    availability_data = {}
    
    try:
        async with aiohttp.ClientSession() as session:
            tasks = [
                fetch_classroom_data(session, space_id, today_date) 
                for space_id in CLASSROOMS.keys()
            ]
            results = await asyncio.gather(*tasks)
            
            for space_id, data in zip(CLASSROOMS.keys(), results):
                if not data:
                    availability_data[str(space_id)] = []
                    continue
                    
                try:
                    available_times = get_available_times(data, today_date, space_id)
                    availability_data[str(space_id)] = [
                        {
                            'start': slot['start'].strftime('%H:%M:%S'),
                            'end': slot['end'].strftime('%H:%M:%S')
                        }
                        for slot in available_times
                    ] if available_times else []
                except Exception as e:
                    print(f'Error processing space {space_id}: {str(e)}')
                    availability_data[str(space_id)] = []
        
        print('Successfully fetched classroom availability')
        return availability_data
    except Exception as e:
        print(f'Error getting classroom availability: {str(e)}')
        return {}