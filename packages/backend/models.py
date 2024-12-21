from sqlalchemy import Column, Integer, String, Text
from database import Base

class UserRule(Base):
    __tablename__ = "user_rules"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    cid = Column(String, unique=True, index=True)