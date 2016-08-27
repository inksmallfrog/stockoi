from stock.index import socket_io, app
from stock.model.model_admin import db

if __name__ == '__main__':
    db.create_all()
    socket_io.run(app)
