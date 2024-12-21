from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import UserRule
from schemas import RuleCreate, RuleResponse
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/store-cid/", response_model=RuleResponse)
def store_cid(rule: RuleCreate, db: Session = Depends(get_db)):
    db_rule = UserRule(username=rule.username, cid=rule.cid)
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule

import requests
@router.get("/retrieve-rules/{cid}/")
def retrieve_rules(cid: str):
    ipfs_gateway = "https://ipfs.io/ipfs/"
    response = requests.get(f"{ipfs_gateway}{cid}")
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=404, detail="Rules not found")
    
@router.post("/apply-rules/")
def apply_rules(prompt: str, cid: str):
    ipfs_gateway = "https://ipfs.io/ipfs/"
    response = requests.get(f"{ipfs_gateway}{cid}")
    if response.status_code == 200:
        rules = response.json()
        result = analyze_prompt(prompt, rules)
        return {"result": result}
    else:
        raise HTTPException(status_code=404, detail="Rules not found")