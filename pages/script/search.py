from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error as MySQLError

app = Flask(__name__)
CORS(app)  # Habilita CORS para toda la aplicación Flask

# Configuración de la base de datos
db_config = {
    'host': 'roundhouse.proxy.rlwy.net',
    'user': 'root',
    'password': 'HVFGToBRQhMlEWishroAhfpHakPUpSWB',
    'database': 'railway',
    'port': 38091,
    'autocommit': True  # Para asegurar que las transacciones se autocommitan
}

# Función para obtener personajes por nombre
def get_characters_by_name(name):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM brawlers WHERE name LIKE %s"
        cursor.execute(query, (name + '%',))
        results = cursor.fetchall()
        return results
    except MySQLError as e:
        print(f"Error MySQL al buscar por nombre: {e}")
        return []
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Función para obtener un personaje por su ID
def get_character_by_id(character_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM brawlers WHERE id = %s"
        cursor.execute(query, (character_id,))
        result = cursor.fetchone()
        return result
    except MySQLError as e:
        print(f"Error MySQL al buscar por ID: {e}")
        return None
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/search', methods=['GET'])
def search_characters():
    query = request.args.get('query')
    if query:
        if query.isdigit():
            result = get_character_by_id(int(query))
        else:
            result = get_characters_by_name(query)
        
        if result:
            return jsonify(result)
    
    return jsonify([])

if __name__ == '__main__':
    # Para ejecutar con Uvicorn
    app.run(debug=True)
