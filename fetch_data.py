import os
import glob
import pandas as pd
import psycopg2
from datetime import datetime
from dotenv import load_dotenv


load_dotenv()

def extract_instrument_name(contract):
    if '.' in contract:
        return contract.split('.')[0]
    else:
        return contract.split()[0]


def extract_legs_details(contract):
    splits = str(contract).split()
    strike = None
    option_type = None
    expiration_date = None

    #extracts expiration date 
    if len(splits) > 2 and len(splits[2]) == 8 and splits[2].isdigit():
        try:
            expiration_date = datetime.strptime(splits[2], "%Y%m%d").date()
                      
        except Exception as e:
            print(f"Error while extracting: '{contract}': {e}")
            expiration_date = None

    #extracts option type and strike
    if len(splits) >= 7:
        option_type = splits[5]  
        strike = float(splits[6])

    return strike, option_type, expiration_date


def read_csv_file(file_path):
    current_file = pd.read_csv(file_path, sep=';')
    
    if '#Date' in current_file.columns:
        current_file.rename(columns={'#Date': 'Date'}, inplace=True)
    return current_file


def insert_in_database(connect, current_file):
    cursor = connect.cursor()
    number_of_trades = len(current_file)
    
    i = 0
    while i < number_of_trades:
        row = current_file.iloc[i]
        contract = row['Contract']
            
        #identifies box spread 
        if "BOX" in contract:
            try:
                box_date = datetime.strptime(row['Date'], "%d.%m.%Y")
            except Exception as e:
                print(f"Error while parsing date: {e}")
                box_date = None
            try:
                box_trdtime = datetime.strptime(row['TrdTime'], "%H:%M:%S.%f").time()
            except Exception as e:
                print(f"Error while parsing trade time: {e}")
                box_trdtime = None
            try:
                box_premium = float(row['Prc'])
            except Exception as e:
                print(f"Error while parsing premium: {e}")
                box_premium = None
            try:
                box_volume = float(row['Qty'])
            except Exception as e:
                print(f"Error while parsing volume: {e}")
                box_volume = None

            instrument = extract_instrument_name(contract)

            #next four rows are legs of the current box
            legs = []
            leg_details = []  #strike, option_type, expiration_date
            for j in range(1, 5):
                if i + j < number_of_trades:
                    leg_row = current_file.iloc[i + j]
                    leg_contract = leg_row['Contract']
                    
                    strike, option_type, exp_date = extract_legs_details(leg_contract)
                    if strike is not None:
                        legs.append(strike)
                        leg_details.append((strike, option_type, exp_date))

            if legs:
                lower_strike = min(legs)
                higher_strike = max(legs)
                
            else:
                lower_strike = None
                higher_strike = None

            #gets box expiration date from leg details
            if leg_details:
                expiration_dates = [detail[2] for detail in leg_details if detail[2] is not None]
                if expiration_dates:
                    box_expiration_date = expiration_dates[0]
                
                else:
                    box_expiration_date = None
            else:
                box_expiration_date = None

            #calculates contract duration in days
            if box_date is not None and box_expiration_date is not None:
                contract_duration = (box_expiration_date - box_date.date()).days
            else:
                contract_duration = None

            #calculates annualized interest rate
            if (lower_strike is not None and higher_strike is not None and box_premium is not None and contract_duration and contract_duration > 0 and (higher_strike - lower_strike) != 0):
                interest_rate = ((1 - (box_premium / (higher_strike - lower_strike))) * (365 / contract_duration))*100
            else:
                interest_rate = None

            print(f"Extracted box spread in row {i}: {box_expiration_date}, {interest_rate}")
      
            #insert into box_spreads table
            cursor.execute("""
                INSERT INTO box_spreads (date, trdtime, instrument, lower_strike, higher_strike, premium, volume, interest_rate, expiration_date, contract_duration)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id; """, (box_date, box_trdtime, instrument, lower_strike, higher_strike, box_premium, box_volume, interest_rate, box_expiration_date, contract_duration))
            box_id = cursor.fetchone()[0]
            print(f"Inserted box spread: {box_id}, {instrument}, {lower_strike}, {higher_strike}, {box_trdtime}, {box_volume}, {interest_rate}, {box_expiration_date}, {contract_duration}")

            '''
            #insert into box_spread_legs table
            for strike, option_type, exp_date in leg_details:
                cursor.execute("""INSERT INTO box_spread_legs (box_spread_id, leg_strike, option_type, expiration_date) 
                               VALUES (%s, %s, %s, %s); """, (box_id, strike, option_type, exp_date))
                print(f"Inserted leg for box {box_id} with strike {strike}, option type {option_type}, expiration {exp_date}")
                
            '''
            i += 5
            
        else:
            i += 1
            
    connect.commit()
    cursor.close()
    

if __name__ == "__main__":
    #gets data from every new CSV file in the data_files folder
    data_folder = "data_files"
    csv_files = glob.glob(os.path.join(data_folder, "*.csv"))
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    connect = psycopg2.connect(DATABASE_URL, sslmode="require")

    
    for file_path in csv_files:
        with open("processed_files.txt", "r+") as f:
            processed = f.read().splitlines()
            
            if file_path in processed:
                continue
            
            print(f"Processing file: {file_path}")
            
            current_file = read_csv_file(file_path)
            insert_in_database(connect, current_file)
            f.write(file_path + '\n')

    connect.close()
