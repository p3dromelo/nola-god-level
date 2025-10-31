import os
import psycopg2

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'challenge_db')
DB_USER = os.getenv('DB_USER', 'challenge')
DB_PASS = os.getenv('DB_PASS', 'challenge_2024')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )