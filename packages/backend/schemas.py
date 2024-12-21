from pydantic import BaseModel

class RuleCreate(BaseModel):
    username: str
    cid: str

class RuleResponse(BaseModel):
    id: int
    username: str
    cid: str

    class Config:
        orm_mode = True