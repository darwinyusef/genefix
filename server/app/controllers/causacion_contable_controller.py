from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.database import get_db
from models import CausacionContable as CausacionContableModel
from shemas.shema_causacion_contable import CausacionContableCreate, CausacionContableUpdate, CausacionContable
from config.config import get_current_user 

router = APIRouter()

@router.post("/", response_model=CausacionContable)
def create_causacion(causacion: CausacionContableCreate, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    db_causacion = CausacionContableModel(
        id_documento=causacion.id_documento,
        id_comprobante=causacion.id_comprobante,
        id_nit=causacion.id_nit,
        fecha=causacion.fecha,
        fecha_manual=causacion.fecha_manual,
        id_cuenta=causacion.id_cuenta,
        valor=causacion.valor,
        tipo=causacion.tipo,
        concepto=causacion.concepto,
        documento_referencia=causacion.documento_referencia,
        token=None,
        extra=None,
        user_id=token["sub"]  # Asegúrate de que el usuario autenticado tiene el id disponible
    )
    db.add(db_causacion)
    db.commit()
    db.refresh(db_causacion)
    return db_causacion

@router.get("/{id}", response_model=CausacionContable)
def read_causacion(id: int, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    db_causacion = db.query(CausacionContableModel).filter(CausacionContableModel.id == id).first()
    if db_causacion is None:
        raise HTTPException(status_code=404, detail="Causación no encontrada")
    return db_causacion

@router.put("/{id}", response_model=CausacionContable)
def update_causacion(id: int, causacion: CausacionContableUpdate, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    db_causacion = db.query(CausacionContableModel).filter(CausacionContableModel.id == id).first()
    if db_causacion is None:
        raise HTTPException(status_code=404, detail="Causación no encontrada")
    
    for key, value in causacion.dict(exclude_unset=True).items():
        setattr(db_causacion, key, value)
    
    db.commit()
    db.refresh(db_causacion)
    return db_causacion

@router.delete("/{id}", response_model=CausacionContable)
def delete_causacion(id: int, db: Session = Depends(get_db), token: dict = Depends(get_current_user)):
    db_causacion = db.query(CausacionContableModel).filter(CausacionContableModel.id == id).first()
    if db_causacion is None:
        raise HTTPException(status_code=404, detail="Causación no encontrada")
    
    db.delete(db_causacion)
    db.commit()
    return db_causacion