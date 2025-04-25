# models.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    document = Column(String(100), unique=True, index=True)
    name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    rol = Column(String(50), nullable=True)
    email_verified_at = Column(DateTime, nullable=True)
    password = Column(String(255), nullable=True)
    remember_token = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PasswordResetToken(Base):
    __tablename__ = 'password_reset_tokens'

    email = Column(String(100), primary_key=True, index=True)
    token = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    