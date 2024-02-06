#!/usr/bin/env python3
""" displays welcome to holberton """
from flask import Flask, render_template, request
from flask_babel import Babel, _

app = Flask(__name__)

babel = Babel(app)

class Config:
    LANGUAGES = ["en", "fr"]

app.config.from_object(Config)

babel.init_app(app, default_locale='en', default_timezone='UTC')

@babel.localeselector
def get_locale():
    """Determine the best-matched language from supported languages."""
    if 'locale' in request.args and request.args['locale'] in app.config['LANGUAGES']:
        return request.args['locale']

    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/', strict_slashes=False)
def hello():
    """Function for displaying welcome to Holberton."""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
