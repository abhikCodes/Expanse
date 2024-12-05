# quiz/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError

# Database URL
URL_DATABASE = 'postgresql://postgres:pratham@localhost:5432/quizdb'

# Create the engine
try:
    engine = create_engine(URL_DATABASE)
except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
    raise e

# Create a session maker bound to the engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# Create all tables in the database if they do not exist
Base.metadata.create_all(bind=engine)
