from flask import Flask, jsonify
from flask_cors import CORS 
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import dateutil.parser
import os
from dotenv import load_dotenv




app = Flask(__name__)
CORS(app)
load_dotenv()

def connect_to_db():
    url = os.getenv("DATABASE_URL")

    return psycopg2.connect(url, sslmode="require", cursor_factory=RealDictCursor)


@app.route('/api/estx50', methods=['GET'])
def get_estx50_box_spreads():
    connect = connect_to_db()
    cursor = connect.cursor(cursor_factory = RealDictCursor)
    
    cursor.execute("""
        SELECT 
            id, 
            date,
            instrument,
            interest_rate, 
            expiration_date,
            trdtime,
            contract_duration,
            lower_strike,
            higher_strike
            
        FROM box_spreads 
        WHERE instrument LIKE 'OESX'
    """)
    
    box_spreads = cursor.fetchall()
    
    #combines 'date' and 'trdtime' to 'datetime'
    for row in box_spreads:
        if row.get('trdtime') is not None:
            if not isinstance(row['trdtime'], str):
                row['trdtime'] = row['trdtime'].strftime("%H:%M:%S")
                
        else:
            row['trdtime'] = "00:00:00"
        
        #parses date if string
        if isinstance(row.get('date'), str):
            try:
                parsed_date = dateutil.parser.parse(row['date'])
                
            except Exception as e:
                parsed_date = None
                
        else:
            parsed_date = row.get('date')
        
        if parsed_date:
            #combines times to datetime.
            combined_dt = datetime.combine(parsed_date, datetime.strptime(row['trdtime'], "%H:%M:%S").time())
            row['datetime'] = combined_dt.isoformat()
            
        else:
            row['datetime'] = None

    cursor.close()
    connect.close()
    
    return jsonify(box_spreads)



@app.route('/api/smi', methods=['GET'])
def get_smi_box_trades():
    connect = connect_to_db()

    cursor = connect.cursor(cursor_factory = RealDictCursor)

    cursor.execute("""
        SELECT 
            id, 
            date,
            instrument,
            interest_rate, 
            expiration_date,
            trdtime,
            contract_duration,
            lower_strike,
            higher_strike
        FROM box_spreads 
        WHERE instrument LIKE 'OSMI'

       
    """)
    box_spreads = cursor.fetchall()
    
    for row in box_spreads:
        if row.get('trdtime') is not None:
            if not isinstance(row['trdtime'], str):
                row['trdtime'] = row['trdtime'].strftime("%H:%M:%S")
        else:
            row['trdtime'] = "00:00:00"  
        
        if isinstance(row.get('date'), str):
            parsed_date = dateutil.parser.parse(row['date'])
        else:
            parsed_date = row.get('date')
        
        if parsed_date:
            combined_dt = datetime.combine(parsed_date, datetime.strptime(row['trdtime'], "%H:%M:%S").time())
            row['datetime'] = combined_dt.isoformat()
        else:
            row['datetime'] = None
            
    
    cursor.close()
    connect.close()
    
    return jsonify(box_spreads)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
