import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS

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

def get_characters(name):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        # Usar LIKE para buscar caracteres que comiencen con la entrada
        query = "SELECT * FROM brawlers WHERE name LIKE %s"
        cursor.execute(query, (name + '%',))  # Utiliza name + '%' para buscar nombres que comiencen con name
        results = cursor.fetchall()
        conn.close()
        return results
    except Exception as e:
        print(f"Error en la base de datos: {e}")
        return []

@app.route('/search', methods=['GET'])
def search_characters():
    query = request.args.get('query')
    if query:
        results = get_characters(query)
        return jsonify(results)
    else:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)

