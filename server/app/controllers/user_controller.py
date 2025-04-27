from typing import List

from fastapi import APIRouter
from fastapi import HTTPException, Depends
from app.shemas.shema_user import UserCreate, UserUpdate, UserRolActive, UserOut
from fastapi.responses import JSONResponse
from app.config.config import hash_password
from app.config.database import get_db
from sqlalchemy.orm import Session
from app.models import User
from datetime import datetime, timezone
from app.config.config import get_current_user

router = APIRouter()

# Crear usuario
@router.post("/users", tags=["Users"], response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Document already registered")
    new_user = User(
        username=user.username,
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        rol="inactive",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return JSONResponse(new_user)

# Crear usuario
@router.put("/activate", tags=["Users"], response_model=UserOut)
def activate_user(user: UserRolActive, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    if token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    
    act_user = db.query(User).filter(User.username == user.username).first()
    if not act_user:
        raise HTTPException(status_code=404, detail="User not found")

    act_user.rol = user.rol
    act_user.name = user.name
    
    db.commit()
    db.refresh(act_user)
    return JSONResponse(act_user)


# Editar usuario
@router.put("/users/{user_id}", tags=["Users"], response_model=UserOut)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    
    db_user = db.query(User).filter(User.id == token['sub']).first()
    get_current_user(token["rol"])
    if token["rol"] != "admin":
        db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db_user.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_user)
    return db_user

# Listar usuarios
@router.get("/users", tags=["Users"], response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    if token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    
    users = db.query(User).all()
    return users

# Obtener usuario por ID
@router.get("/users/{user_id}", tags=["Users"], response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.id == token['sub']).first()
    get_current_user(token["rol"])
    if token["rol"] != "admin":
        user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
