import os
from dotenv import load_dotenv

if os.getenv("RAILWAY_ENV") is None:
    load_dotenv()

REDIS_URL = os.getenv('REDIS_URL')
API_URL = os.getenv('API_URL')

REDIS_TIMEOUT = 5  # seconds
CACHE_KEY = 'classrooms:availability'
CACHE_EXPIRY = 12 * 60 * 60  # 12 hours
MIN_GAP_MINUTES = 15

BUILDINGS = {
    "CAS": {
        "code": "CAS",
        "name": "College of Arts & Sciences",
        "business_start_hour": 7,
        "business_end_hour": 23,
    },
    "CGS": {
        "code": "CGS",
        "name": "College of General Studies",
        "business_start_hour": 7,
        "business_end_hour": 21.5,
    }
}

CLASSROOMS = {
    "461": {"id": "461", "name": "Tsai", "building_code": "CAS"},
    "406": {"id": "406", "name": "114A", "building_code": "CAS"},
    "407": {"id": "407", "name": "114B", "building_code": "CAS"},
    "342": {"id": "342", "name": "116", "building_code": "CAS"},
    "4335": {"id": "4335", "name": "132", "building_code": "CAS"},
    "344": {"id": "344", "name": "201", "building_code": "CAS"},
    "345": {"id": "345", "name": "203", "building_code": "CAS"},
    "409": {"id": "409", "name": "204A", "building_code": "CAS"},
    "417": {"id": "417", "name": "204B", "building_code": "CAS"},
    "346": {"id": "346", "name": "208", "building_code": "CAS"},
    "349": {"id": "349", "name": "211", "building_code": "CAS"},
    "350": {"id": "350", "name": "212", "building_code": "CAS"},
    "351": {"id": "351", "name": "213", "building_code": "CAS"},
    "352": {"id": "352", "name": "214", "building_code": "CAS"},
    "353": {"id": "353", "name": "216", "building_code": "CAS"},
    "354": {"id": "354", "name": "218", "building_code": "CAS"},
    "355": {"id": "355", "name": "220", "building_code": "CAS"},
    "357": {"id": "357", "name": "222", "building_code": "CAS"},
    "358": {"id": "358", "name": "223", "building_code": "CAS"},
    "359": {"id": "359", "name": "224", "building_code": "CAS"},
    "360": {"id": "360", "name": "225", "building_code": "CAS"},
    "361": {"id": "361", "name": "226", "building_code": "CAS"},
    "362": {"id": "362", "name": "227", "building_code": "CAS"},
    "363": {"id": "363", "name": "228", "building_code": "CAS"},
    "364": {"id": "364", "name": "229", "building_code": "CAS"},
    "365": {"id": "365", "name": "233", "building_code": "CAS"},
    "366": {"id": "366", "name": "235", "building_code": "CAS"},
    "367": {"id": "367", "name": "237", "building_code": "CAS"},
    "418": {"id": "418", "name": "303A", "building_code": "CAS"},
    "5888": {"id": "5888", "name": "306", "building_code": "CAS"},
    "4525": {"id": "4525", "name": "310", "building_code": "CAS"},
    "4520": {"id": "4520", "name": "312", "building_code": "CAS"},
    "372": {"id": "372", "name": "313", "building_code": "CAS"},
    "4521": {"id": "4521", "name": "314", "building_code": "CAS"},
    "374": {"id": "374", "name": "315", "building_code": "CAS"},
    "4522": {"id": "4522", "name": "316", "building_code": "CAS"},
    "4523": {"id": "4523", "name": "318", "building_code": "CAS"},
    "4524": {"id": "4524", "name": "320", "building_code": "CAS"},
    "5808": {"id": "5808", "name": "322", "building_code": "CAS"},
    "5805": {"id": "5805", "name": "323A", "building_code": "CAS"},
    "5806": {"id": "5806", "name": "323B", "building_code": "CAS"},
    "382": {"id": "382", "name": "324", "building_code": "CAS"},
    "5807": {"id": "5807", "name": "325", "building_code": "CAS"},
    "384": {"id": "384", "name": "326", "building_code": "CAS"},
    "385": {"id": "385", "name": "327", "building_code": "CAS"},
    "387": {"id": "387", "name": "335", "building_code": "CAS"},
    "5809": {"id": "5809", "name": "424", "building_code": "CAS"},
    "5811": {"id": "5811", "name": "425", "building_code": "CAS"},
    "5810": {"id": "5810", "name": "426", "building_code": "CAS"},
    "5812": {"id": "5812", "name": "427", "building_code": "CAS"},
    "395": {"id": "395", "name": "430", "building_code": "CAS"},
    "410": {"id": "410", "name": "521", "building_code": "CAS"},
    "411": {"id": "411", "name": "522", "building_code": "CAS"},
    "412": {"id": "412", "name": "530", "building_code": "CAS"},
    "413": {"id": "413", "name": "534", "building_code": "CAS"},
    "416": {"id": "416", "name": "538", "building_code": "CAS"},
    "434": {"id": "434", "name": "B06A", "building_code": "CAS"},
    "435": {"id": "435", "name": "B06B", "building_code": "CAS"},
    "437": {"id": "437", "name": "B08A", "building_code": "CAS"},
    "438": {"id": "438", "name": "B08B", "building_code": "CAS"},
    "439": {"id": "439", "name": "B12", "building_code": "CAS"},
    "4330": {"id": "4330", "name": "B18", "building_code": "CAS"},
    "443": {"id": "443", "name": "B20", "building_code": "CAS"},
    "5802": {"id": "5802", "name": "B25A", "building_code": "CAS"},
    "5803": {"id": "5803", "name": "B25B", "building_code": "CAS"},
    "5804": {"id": "5804", "name": "B27", "building_code": "CAS"},
    "450": {"id": "450", "name": "B36", "building_code": "CAS"},
    "780": {"id": "780", "name": "111A", "building_code": "CGS"},
    "781": {"id": "781", "name": "111B", "building_code": "CGS"},
}

CLASSROOMS_ALL = {
    "461": {"id": "461", "name": "Tsai", "building_code": "CAS"},
    "406": {"id": "406", "name": "114A", "building_code": "CAS"},
    "407": {"id": "407", "name": "114B", "building_code": "CAS"},
    "342": {"id": "342", "name": "116", "building_code": "CAS"},
    "4335": {"id": "4335", "name": "132", "building_code": "CAS"},
    "344": {"id": "344", "name": "201", "building_code": "CAS"},
    "345": {"id": "345", "name": "203", "building_code": "CAS"},
    "409": {"id": "409", "name": "204A", "building_code": "CAS"},
    "417": {"id": "417", "name": "204B", "building_code": "CAS"},
    "346": {"id": "346", "name": "208", "building_code": "CAS"},
    "349": {"id": "349", "name": "211", "building_code": "CAS"},
    "350": {"id": "350", "name": "212", "building_code": "CAS"},
    "351": {"id": "351", "name": "213", "building_code": "CAS"},
    "352": {"id": "352", "name": "214", "building_code": "CAS"},
    "353": {"id": "353", "name": "216", "building_code": "CAS"},
    "354": {"id": "354", "name": "218", "building_code": "CAS"},
    "355": {"id": "355", "name": "220", "building_code": "CAS"},
    "356": {"id": "356", "name": "221P", "building_code": "CAS"},
    "357": {"id": "357", "name": "222", "building_code": "CAS"},
    "358": {"id": "358", "name": "223", "building_code": "CAS"},
    "359": {"id": "359", "name": "224", "building_code": "CAS"},
    "360": {"id": "360", "name": "225", "building_code": "CAS"},
    "361": {"id": "361", "name": "226", "building_code": "CAS"},
    "362": {"id": "362", "name": "227", "building_code": "CAS"},
    "363": {"id": "363", "name": "228", "building_code": "CAS"},
    "364": {"id": "364", "name": "229", "building_code": "CAS"},
    "365": {"id": "365", "name": "233", "building_code": "CAS"},
    "366": {"id": "366", "name": "235", "building_code": "CAS"},
    "367": {"id": "367", "name": "237", "building_code": "CAS"},
    "418": {"id": "418", "name": "303A", "building_code": "CAS"},
    "5888": {"id": "5888", "name": "306", "building_code": "CAS"},
    "4525": {"id": "4525", "name": "310", "building_code": "CAS"},
    "4520": {"id": "4520", "name": "312", "building_code": "CAS"},
    "371": {"id": "371", "name": "312P", "building_code": "CAS"},
    "372": {"id": "372", "name": "313", "building_code": "CAS"},
    "4521": {"id": "4521", "name": "314", "building_code": "CAS"},
    "373": {"id": "373", "name": "314P", "building_code": "CAS"},
    "374": {"id": "374", "name": "315", "building_code": "CAS"},
    "4522": {"id": "4522", "name": "316", "building_code": "CAS"},
    "378": {"id": "378", "name": "316P", "building_code": "CAS"},
    "4523": {"id": "4523", "name": "318", "building_code": "CAS"},
    "379": {"id": "379", "name": "318P", "building_code": "CAS"},
    "4524": {"id": "4524", "name": "320", "building_code": "CAS"},
    "5808": {"id": "5808", "name": "322", "building_code": "CAS"},
    "381": {"id": "381", "name": "322P", "building_code": "CAS"},
    "5805": {"id": "5805", "name": "323A", "building_code": "CAS"},
    "419": {"id": "419", "name": "323AP", "building_code": "CAS"},
    "5806": {"id": "5806", "name": "323B", "building_code": "CAS"},
    "420": {"id": "420", "name": "323BP", "building_code": "CAS"},
    "382": {"id": "382", "name": "324", "building_code": "CAS"},
    "5807": {"id": "5807", "name": "325", "building_code": "CAS"},
    "383": {"id": "383", "name": "325P", "building_code": "CAS"},
    "384": {"id": "384", "name": "326", "building_code": "CAS"},
    "385": {"id": "385", "name": "327", "building_code": "CAS"},
    "387": {"id": "387", "name": "335", "building_code": "CAS"},
    "5809": {"id": "5809", "name": "424", "building_code": "CAS"},
    "389": {"id": "389", "name": "424P", "building_code": "CAS"},
    "5811": {"id": "5811", "name": "425", "building_code": "CAS"},
    "390": {"id": "390", "name": "425P", "building_code": "CAS"},
    "5810": {"id": "5810", "name": "426", "building_code": "CAS"},
    "392": {"id": "392", "name": "426P", "building_code": "CAS"},
    "5812": {"id": "5812", "name": "427", "building_code": "CAS"},
    "394": {"id": "394", "name": "428P", "building_code": "CAS"},
    "395": {"id": "395", "name": "430", "building_code": "CAS"},
    "410": {"id": "410", "name": "521", "building_code": "CAS"},
    "411": {"id": "411", "name": "522", "building_code": "CAS"},
    "412": {"id": "412", "name": "530", "building_code": "CAS"},
    "413": {"id": "413", "name": "534", "building_code": "CAS"},
    "416": {"id": "416", "name": "538", "building_code": "CAS"},
    "434": {"id": "434", "name": "B06A", "building_code": "CAS"},
    "435": {"id": "435", "name": "B06B", "building_code": "CAS"},
    "437": {"id": "437", "name": "B08A", "building_code": "CAS"},
    "438": {"id": "438", "name": "B08B", "building_code": "CAS"},
    "439": {"id": "439", "name": "B12", "building_code": "CAS"},
    "440": {"id": "440", "name": "B14P", "building_code": "CAS"},
    "4330": {"id": "4330", "name": "B18", "building_code": "CAS"},
    "441": {"id": "441", "name": "B18AP", "building_code": "CAS"},
    "442": {"id": "442", "name": "B18BP", "building_code": "CAS"},
    "443": {"id": "443", "name": "B20", "building_code": "CAS"},
    "5802": {"id": "5802", "name": "B25A", "building_code": "CAS"},
    "444": {"id": "444", "name": "B25AP", "building_code": "CAS"},
    "5803": {"id": "5803", "name": "B25B", "building_code": "CAS"},
    "445": {"id": "445", "name": "B25BP", "building_code": "CAS"},
    "5804": {"id": "5804", "name": "B27", "building_code": "CAS"},
    "446": {"id": "446", "name": "B27P", "building_code": "CAS"},
    "450": {"id": "450", "name": "B36", "building_code": "CAS"},
    "780": {"id": "780", "name": "111A", "building_code": "CGS"},
    "781": {"id": "781", "name": "111B", "building_code": "CGS"},
}