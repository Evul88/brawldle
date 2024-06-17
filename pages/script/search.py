from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from uvicorn import run

app = Flask(__name__)
CORS(app)  # Habilita CORS para toda la aplicación Flask

# Configuración de la base de datos
db_config = {
    'host': 'roundhouse.proxy.rlwy.net',
    'user': 'root',
    'password': 'HVFGToBRQhMlEWishroAhfpHakPUpSWB',
    'database': 'railway',
    'port': 38091
}

# Función para obtener personajes por nombre
def get_characters_by_name(name):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)  # Utiliza dictionary=True para obtener los resultados como diccionarios
        query = "SELECT * FROM brawlers WHERE name LIKE %s"
        cursor.execute(query, (name + '%',))  # Agregar % para buscar nombres que comiencen con 'name'
        results = cursor.fetchall()
        conn.close()
        return results
    except Exception as e:
        print(f"Error en la base de datos: {e}")
        return []

# Función para obtener un personaje por su ID
def get_character_by_id(character_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)  # Utiliza dictionary=True para obtener los resultados como diccionarios
        query = "SELECT * FROM brawlers WHERE id = %s"
        cursor.execute(query, (character_id,))
        results = cursor.fetchone()
        conn.close()
        return results
    except Exception as e:
        print(f"Error en la base de datos: {e}")
        return None

@app.route('/search', methods=['GET'])
def search_characters():
    query = request.args.get('query')
    if query:
        if query.isdigit():  # Si query es un número, buscar por ID
            result = get_character_by_id(int(query))
        else:  # Si query es una cadena, buscar por nombre
            result = get_characters_by_name(query)
        
        if result:
            return jsonify(result)
        else:
            return jsonify([])

    else:
        return jsonify([])

if __name__ == '__main__':
    # Ejecutar la aplicación con Uvicorn para aprovechar su capacidad asincrónica
    app.run(debug=True)

