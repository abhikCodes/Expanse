# quiz/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError

# Database URL
URL_DATABASE = 'postgresql://postgres:password@host.docker.internal:5432/quizDB'

# Create the engine
try:
    engine = create_engine(URL_DATABASE, echo=True)
except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
    raise e

# Create a session maker bound to the engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()
