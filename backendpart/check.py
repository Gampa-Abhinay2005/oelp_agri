import psycopg2

db_params = {
    "dbname": "satcad_db",
    "user": "satcad_user",
    "password": "satdcad@123",
    "host": "localhost",  
    "port": "5432",
}

try:
    # Establish the connection
    conn = psycopg2.connect(**db_params)
    
    # Create a cursor object
    cur = conn.cursor()
    
    # Execute a simple query
    cur.execute("SELECT version();")
    
    # Fetch the result
    db_version = cur.fetchone()
    print("Connected to:", db_version)
    
    # Close the cursor and connection
    cur.close()
    conn.close()
    
except psycopg2.Error as e:
    print("Error connecting to PostgreSQL:", e)
