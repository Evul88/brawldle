from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from typing import List, Union
from pydantic import BaseModel

app = FastAPI()

# Configuración de CORS
origins = ["*"]  # Permitir acceso desde cualquier origen, ajustar según necesidades
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos
db_config = {
    'host': 'roundhouse.proxy.rlwy.net',
    'user': 'root',
    'password': 'HVFGToBRQhMlEWishroAhfpHakPUpSWB',
    'database': 'railway',
    'port': 38091
}

# Modelo Pydantic para el resultado de búsqueda
class Character(BaseModel):
    id: int
    name: str
    # Agregar más campos según la estructura de tu base de datos

# Función para obtener personajes por nombre
def get_characters_by_name(name: str) -> List[Character]:
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM brawlers WHERE name LIKE %s"
        cursor.execute(query, (name + '%',))
        results = cursor.fetchall()
        conn.close()
        return results
    except Exception as e:
        print(f"Error en la base de datos: {e}")
        return []

# Función para obtener un personaje por su ID
def get_character_by_id(character_id: int) -> Union[Character, None]:
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM brawlers WHERE id = %s"
        cursor.execute(query, (character_id,))
        result = cursor.fetchone()
        conn.close()
        return result
    except Exception as e:
        print(f"Error en la base de datos: {e}")
        return None

# Ruta para buscar personajes
@app.get('/search/', response_model=List[Character])
async def search_characters(query: str):
    if not query:
        return []
    
    if query.isdigit():
        result = get_character_by_id(int(query))
    else:
        result = get_characters_by_name(query)

    if result:
        return result
    else:
        return []

# No es necesario app.run() aquí si usamos Uvicorn para ejecutar

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
