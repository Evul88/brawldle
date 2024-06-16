#!/usr/bin/env python3

import cgi
import json
import mysql.connector

def get_characters(name):
    conn = mysql.connector.connect(
        host="roundhouse.proxy.rlwy.net",
        user="root",
        password="HVFGToBRQhMlEWishroAhfpHakPUpSWB",
        database="railway"
    )
    cursor = conn.cursor()
    # Usar un LIKE para buscar caracteres que coincidan con la entrada
    query = "SELECT * FROM brawlers WHERE name LIKE %s"
    cursor.execute(query, ('%' + name + '%',))
    results = cursor.fetchall()
    conn.close()
    return results

# Obtener datos del formulario CGI
form = cgi.FieldStorage()
query = form.getvalue('query')

# Configurar los encabezados HTTP para indicar que se envía JSON
print("Content-Type: application/json")
print()

if query:
    results = get_characters(query)
    # Convertir resultados a formato JSON y enviarlos
    print(json.dumps(results))
else:
    # Enviar un arreglo vacío si no hay consulta
    print(json.dumps([]))
