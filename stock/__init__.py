__author__ = 'ammirkhan'
from flask import *

app = Flask(__name__)
app.secret_key = 'secret_key'

import stock.index