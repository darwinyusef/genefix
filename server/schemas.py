from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    document: str
    name: Optional[str] = None
    email: Optional[str] = None
    rol: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    email_verified_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class PasswordResetTokenCreate(BaseModel):
    email: str
    token: str