#!/usr/bin/env python3
""" displays welcome to holberton """
from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)

babel = Babel(app)


class Config:
    """configures languages
    """
    LANGUAGES = ["en", "fr"]


app.config.from_object(Config)

babel.init_app(app, default_locale='en',
               default_timezone='UTC')


@app.route('/', strict_slashes=False)
def hello():
    """ function for displaying
    welcome to holberton """
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
