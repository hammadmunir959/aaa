import os

import django
from django.conf import settings
from django.core.files import File

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from vehicles.models import Vehicle

fleet_data = [
    {
        "manufacturer": "Mercedes-Benz",
        "model": "E 300 AMG Line NGT Ed Prem+",
        "model_detail": "E300e 9G-Tronic Auto PHEV EQ Power 320 (122Hp/90Kw) Start/Stop",
        "color": "Grey",
        "body_style": "Saloon",
        "fuel_type": "hybrid_electric",
        "engine_size": "1991 cc",
        "euro_status": "6ap",
        "registered_year_date": "01 Nov 2021",
        "image_filename": "generated_mercedes_e300_grey.png",
        "type": "sedan",
        "daily_rate": 150.00,
        "seats": 5,
        "registration": "MB-E300-01",
    },
    {
        "manufacturer": "Mercedes-Benz",
        "model": "E 200 D SE Auto",
        "model_detail": "E200d Bluetec 9G-Tronic Auto Start/Stop",
        "color": "Black",
        "body_style": "Saloon",
        "fuel_type": "diesel",
        "engine_size": "1950 cc",
        "euro_status": "6b",
        "registered_year_date": "31 Mar 2018",
        "image_filename": "generated_mercedes_e200_black.png",
        "type": "sedan",
        "daily_rate": 120.00,
        "seats": 5,
        "registration": "MB-E200-02",
    },
    {
        "manufacturer": "Audi",
        "model": "A8 L 60 TFSI E Quattro Auto",
        "model_detail": "60 TFSIe 449 Quattro Tip PHEV 17.9kWh Auto Start/Stop",
        "color": "Black",
        "body_style": "Limousine",
        "fuel_type": "hybrid_electric",
        "engine_size": "2995 cc",
        "euro_status": "6dg",
        "registered_year_date": "22 Jul 2020",
        "image_filename": "generated_audi_a8_black.png",
        "type": "limousine",
        "daily_rate": 200.00,
        "seats": 5,
        "registration": "AU-A800-03",
    },
    {
        "manufacturer": "Mercedes-Benz",
        "model": "C 200 AMG Line Auto",
        "model_detail": "C200 9G-Tronic BlueEfficiency Auto Start/Stop MHEV EQ Boost",
        "color": "Black",
        "body_style": "Cabriolet",
        "fuel_type": "petrol",
        "engine_size": "1497 cc",
        "euro_status": "6c",
        "registered_year_date": "31 Oct 2018",
        "image_filename": "generated_mercedes_c200_black.png",
        "type": "convertible",
        "daily_rate": 130.00,
        "seats": 4,
        "registration": "MB-C200-04",
    },
    {
        "manufacturer": "Land Rover",
        "model": "Discovery SE SD4 Auto",
        "model_detail": "SD4 240 Auto Start/Stop",
        "color": "Black",
        "body_style": "SUV",
        "fuel_type": "diesel",
        "engine_size": "1999 cc",
        "euro_status": "6c",
        "registered_year_date": "12 Sep 2018",
        "image_filename": "generated_land_rover_discovery_black.png",
        "type": "suv",
        "daily_rate": 160.00,
        "seats": 7,
        "registration": "LR-DISC-05",
    },
    {
        "manufacturer": "Land Rover",
        "model": "Range Rover Sport Autobiography Dynamic",
        "model_detail": "SDV6 306 CommandShift Auto Start/Stop",
        "color": "Black",
        "body_style": "SUV",
        "fuel_type": "diesel",
        "engine_size": "2993 cc",
        "euro_status": "6ag",
        "registered_year_date": "30 Sep 2019",
        "image_filename": "generated_range_rover_sport_black.png",
        "type": "suv",
        "daily_rate": 180.00,
        "seats": 5,
        "registration": "LR-RRS-06",
    },
    {
        "manufacturer": "Volkswagen",
        "model": "Tiguan Life TSI S-A",
        "model_detail": "1.5 TSI EVO 150 DSG Auto 2WD Start/Stop",
        "color": "White",
        "body_style": "SUV",
        "fuel_type": "petrol",
        "engine_size": "1498 cc",
        "euro_status": "6ap",
        "registered_year_date": "Year 2022",
        "image_filename": "generated_vw_tiguan_white.png",
        "type": "suv",
        "daily_rate": 90.00,
        "seats": 5,
        "registration": "VW-TIG-07",
    },
    {
        "manufacturer": "Mercedes-Benz",
        "model": "V-Class",
        "model_detail": "—",
        "color": "—",
        "body_style": "MPV",
        "fuel_type": "diesel",  # Defaulting to diesel for V-Class
        "engine_size": "—",
        "euro_status": "—",
        "registered_year_date": "Year 2025",
        "image_filename": "generated_mercedes_v_class.png",
        "type": "mpv",
        "daily_rate": 150.00,
        "seats": 7,
        "registration": "MB-VCLS-08",
    },
    {
        "manufacturer": "Mercedes-Benz",
        "model": "S-Class",
        "model_detail": "—",
        "color": "—",
        "body_style": "Saloon",
        "fuel_type": "hybrid_electric",  # Default/Guess
        "engine_size": "—",
        "euro_status": "—",
        "registered_year_date": "Year 2023",
        "image_filename": "generated_mercedes_s_class_saloon.png",
        "type": "sedan",
        "daily_rate": 250.00,
        "seats": 5,
        "registration": "MB-SCLS-09",
    },
    {
        "manufacturer": "Kia",
        "model": "Niro",
        "model_detail": "—",
        "color": "—",
        "body_style": "SUV",
        "fuel_type": "hybrid",
        "engine_size": "—",
        "euro_status": "—",
        "registered_year_date": "—",
        "image_filename": "generated_kia_niro_suv.png",
        "type": "suv",
        "daily_rate": 80.00,
        "seats": 5,
        "registration": "KIA-NIR-10",
    },
]

# Determine image source directory based on environment
# In Docker (prod), images are in ./frontend_dist (copied from frontend-builder)
# In Local Dev, images are in ../frontend/public
possible_paths = [
    os.path.join(settings.BASE_DIR, "frontend_dist"),  # Docker / Prod
    os.path.join(
        settings.BASE_DIR, "../frontend/public"
    ),  # Local Dev relative to backend
    "/app/backend/frontend_dist",  # Docker absolute
]

IMAGE_SOURCE_DIR = None
for path in possible_paths:
    if os.path.exists(path):
        IMAGE_SOURCE_DIR = path
        break

if not IMAGE_SOURCE_DIR:
    print("Warning: Could not find image source directory. Tried:", possible_paths)
    # Default to current dir or raise error? Let's assume current dir to avoid crash
    IMAGE_SOURCE_DIR = "."
else:
    print(f"Using image source directory: {IMAGE_SOURCE_DIR}")

for data in fleet_data:
    vehicle, created = Vehicle.objects.get_or_create(
        registration=data["registration"],
        defaults={
            "name": f"{data['manufacturer']} {data['model']}",
            "manufacturer": data["manufacturer"],
            "model": data["model"],
            "model_detail": data["model_detail"],
            "color": data["color"],
            "body_style": data["body_style"],
            "fuel_type": data["fuel_type"],
            "engine_size": data["engine_size"],
            "euro_status": data["euro_status"],
            "registered_year_date": data["registered_year_date"],
            "type": data["type"],
            "daily_rate": data["daily_rate"],
            "seats": data["seats"],
            "status": "available",
        },
    )

    if created or not vehicle.image:
        image_path = os.path.join(IMAGE_SOURCE_DIR, data["image_filename"].lstrip("/"))
        if os.path.exists(image_path):
            with open(image_path, "rb") as img_file:
                vehicle.image.save(data["image_filename"], File(img_file), save=True)
            print(f"Created/Updated {vehicle.name} with image.")
        else:
            print(
                f"Created/Updated {vehicle.name} without image (image not found at {image_path})."
            )
    else:
        print(f"Skipped {vehicle.name} (already exists).")
