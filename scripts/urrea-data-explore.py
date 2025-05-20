import json
import requests
import time

data = None
with open("./urrea_products.json", "r") as f:
    data = json.loads("".join(f.readlines()))
    f.close()

product_keys = set()

productos = data["resultadoDispMasiva"]

for producto in productos:
    product_keys.update(producto.keys())

failed_inserts = []
for producto in productos:
    request = requests.api.post("http://localhost:8080/rest/api/1/urrea/producto", json=producto, headers={
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1ZjkzODA1OS1lMjI2LTQ0MWEtYTUwNi0wYjBkNjE3MzE1NWIiLCJuYW1lIjoiUnViZW4gR2FyY2lhIiwic3ViIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc0MjQ0MTI0NiwiZXhwIjoxNzQyNTI3NjQ2fQ.MfR22sUODci_BK_kThK98WUU4qsAsegGwFyLKrvAEEk"
    })
    

    if request.status_code == 403:
        print(producto["codigo"])
        failed_inserts.append(producto)


with open("failed_inserts.json", "w") as file:
    file.write(json.dumps(failed_inserts, indent=2))

