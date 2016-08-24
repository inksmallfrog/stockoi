from model_admin import String, Integer, db, DECIMAL, DateTime
from werkzeug.security import generate_password_hash, check_password_hash
import re


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(Integer, primary_key=True)
    username = db.Column(String(80), unique=True)
    email = db.Column(String(120), unique=True)
    password_hash = db.Column(String(120))
    stock_list = db.Column(String(60))

    def __init__(self, username, email, password, stock_list):
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.stock_list = stock_list

    @property
    def password(self):
        raise AttributeError('Access denied!')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User %r>' % self.username

    def get_stock_list(self):
        b = re.findall(r'.{6}', self.stock_list)
        return b

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)


class Stock(db.Model):
    __tablename__ = 'stock'
    id = db.Column(Integer, primary_key=True)
    code = db.Column(String(10))
    name = db.Column(String(80))
    market_price = db.Column(DECIMAL(10, 5))
    cost_price = db.Column(DECIMAL(10, 5))
    market_value = db.Column(DECIMAL(10, 5))
    amount = db.Column(Integer)
    profit = db.Column(DECIMAL(10, 5), default=0)
    associate_account = db.Column(String(120))

    def __init__(self, code, name, maket_price, cost_price, maket_value, amount, profit, account):
        self.code = code
        self.name = name
        self.market_price = maket_price
        self.cost_price = cost_price
        self.market_value = maket_value
        self.amount = amount
        self.profit = profit
        self.associate_account = account

    def __repr__(self):
        return '<Stock %r>' % self.code


class MyOrder(db.Model):
    __tablename__ = 'myorder'
    order_id = db.Column(Integer, primary_key=True)
    id = db.Column(String(20))
    code = db.Column(String(20))
    name = db.Column(String(20))
    order_type = db.Column(String(20))
    status = db.Column(String(20))
    price = db.Column(DECIMAL(10, 5))
    count = db.Column(Integer)
    finished = db.Column(String(20))
    market_value = db.Column(DECIMAL(10, 5))
    date_time = db.Column(DateTime)
    associate_id = db.Column(String(80))

    def __init__(self, trade_id, code, name, o_type, status, price, count, finished, maket_value, dt, a_id):
        self.id = trade_id
        self.code = code
        self.name = name
        self.order_type = o_type
        self.status = status
        self.price = price
        self.count = count
        self.finished = finished
        self.market_value = maket_value
        self.date_time = dt
        self.associate_id = a_id

    def __repr__(self):
        return '<Order %r>' % self.id


class Account(db.Model):
    __tablename__ = 'account'
    account_id = db.Column(String(120), primary_key=True)
    associate_id = db.Column(String(80))
    remain = db.Column(DECIMAL(20, 5), default=100000.00)
    frozen = db.Column(DECIMAL(20, 5))
    market_value = db.Column(DECIMAL(20, 5))
    total = db.Column(DECIMAL(20, 5))
    profit_loss = db.Column(DECIMAL(20, 5))
    password_hash = db.Column(String(120))
    brokerage = db.Column(String(120))
    account_type = db.Column(String(120))

    def __init__(self, id,a_id,remain,frozen,market_value,total,profit_loss,password, brokerage, t):
        self.account_id = id
        self.associate_id = a_id
        self.remain = remain
        self.frozen = frozen
        self.market_value = market_value
        self.total = total
        self.profit_loss = profit_loss
        self.password_hash = generate_password_hash(password)
        self.brokerage = brokerage
        self.account_type = t

    @property
    def password(self):
        raise AttributeError('Access denied!')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<Account %r>' % self.account_id