from stock import app
from stock.conf import DATABASE_URL
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, create_engine, Integer, DECIMAL, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

db = SQLAlchemy(app)
engine = create_engine(DATABASE_URL)
DBSession = sessionmaker(bind=engine)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

