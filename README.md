# Panel de administración / delegados

Bootstrap y Vue.js

Para testear localmente los pasos son:

- Ir a `www` y levantar el servidor http con:
```
python2 webserver.py
```

- Cada vez que se cambia algo hay que recompilar. Desde `www` se recompila con
```make```

- Ir a 
```http://localhost:8000/```
con el navegador.



## Build and Run on Testing Server - https://admin.testing.convidarte.com.ar/
1. Tag a commit as a release candidate version with the following rule:
``` vM.m.p-RC ``` being M: Major version, m: minor version, p: patch  and RC indicanting Release Candidate.
2. Push tag:
``` git push --tag ```

Example:
1. ``` git tag v1.0.2-RC ```
2. ``` git push --tag ```



## Build and Run on Production Server - https://admin.convidarte.com.ar/
1. Tag a commit as a release version with the following rule:
``` vM.m.p ``` being M: Major version, m: minor version and p: patch
2. Push tag:
``` git push --tag ```

Example:
1. ``` git tag v1.0.2 ```
2. ``` git push --tag ```


