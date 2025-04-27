from fastapi.openapi.utils import get_openapi
from fastapi.security import  HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, Request, status
from dotenv import load_dotenv

load_dotenv() 
import os
import secrets

# Establecer los esquemas de hashing que usarás
from passlib.context import CryptContext

# Configurar passlib para usar Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Función para obtener el hash de una contraseña
def hash_password(password: str):
    return pwd_context.hash(password)
   
# Función para verificar la contraseña
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Modificar el OpenAPI para agregar el esquema globalmente
def custom_openapi(app):
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="genefix",
        version="0.0.1",
        description="Api de genefix Secure",
        routes=app.routes,
        #authors="@darwinyusef",
        contact={"name": os.getenv("AUTHOR"), "email": "wsgestor@gmail.com"}
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    # Esto aplica globalmente la seguridad
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


def generate_csrf_token():
    return secrets.token_urlsafe(32)


class CustomHTTPBearer(HTTPBearer):
    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials:
        try:
            credentials: HTTPAuthorizationCredentials = await super().__call__(request)
            print(credentials)
            if not credentials:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No se proporcionó token de autenticación."
                )
            return credentials
        except HTTPException as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token inválido o ausente."
            )

security = CustomHTTPBearer()

# y ya tu get_current_user sigue igual
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return credentials.credentials