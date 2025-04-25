from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from auth import verify_password, create_access_token, hash_password, verify_token
from database import get_db
from models import User
from schemas import UserCreate, UserOut 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir los orígenes listados
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Ruta para registrar un nuevo usuario
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.document == user.document).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Document already registered")
    
    hashed_password = hash_password(user.password)
    new_user = User(
        document=user.document,
        name=user.name,
        email=user.email,
        password=hashed_password,
        rol=user.rol
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created successfully"}

# Ruta para hacer login
@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.document == user.document).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

# Ruta protegida para obtener información del usuario
@app.get("/users/me", response_model=UserOut)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = verify_token(token, db)
    return user