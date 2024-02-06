#!/usr/bin/env python3
""" displays welcome to holberton """
from flask import Flask, render_template, request
from flask_babel import Babel, _

app = Flask(__name__)

babel = Babel(app)


class Config:
    """configures languages
    """
    LANGUAGES = ["en", "fr"]


app.config.from_object(Config)


babel.init_app(app, default_locale='en', default_timezone='UTC')


@babel.localeselector
def get_locale():
    """Determine the best-matched language from supported languages."""
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def hello():
    """Function for displaying welcome to Holberton."""
    return render_template('index.html')


if __name__ == "__main__":
    app.run()
