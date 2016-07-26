from stock import app,conf

if __name__ == '__main__':
    app.run(debug=conf.DEBUG)

application = app

