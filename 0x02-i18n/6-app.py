#!/usr/bin/env python3
'''a user login system is outside the scope of this project
'''

from typing import Dict, Union
from flask import Flask, render_template, request, g
from flask_babel import Babel


class Config:
    '''config class'''

    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> Union[Dict, None]:
    """Retrieves a user based on a user id.
    """
    login_id = request.args.get('login_as')
    if login_id:
        return users.get(int(login_id))
    return None


@app.before_request
def before_request() -> None:
    """performs some routines before each request's resolution.
    """
    g.user = get_user()


@babel.user_localegetter
def get_locale() -> str:
    """retrieves the locale for a web page.

    Returns:
        str: best match
    """
    locale_from_url = request.args.get('locale')
    if locale_from_url and locale_from_url in app.config['LANGUAGES']:
        return locale_from_url

    if g.user and g.user.get('locale') in app.config['LANGUAGES']:
        user_locale = g.user.get('locale')
    else:
        None
    if user_locale:
        return user_locale

    locale_from_header = request.accept_languages.best_match(
            app.config['LANGUAGES'])
    if locale_from_header:
        return locale_from_header

    return app.config['BABEL_DEFAULT_LOCALE']


@app.route('/')
def index() -> str:
    '''default route

    Returns:
        html: homepage
    '''
    return render_template("6-index.html")


if __name__ == "__main__":
    app.run()
