#!/usr/bin/env python3
'''a user login system is outside the scope of this project
'''

from typing import Dict, Union
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz


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


def validate_timezone(timezone: str) -> str:
    """Validates if the provided timezone is a valid timezone using pytz.

    Args:
        timezone (str): Timezone string.

    Returns:
        str: Validated timezone or default to UTC.
    """
    try:
        pytz.timezone(timezone)
        return timezone
    except pytz.exceptions.UnknownTimeZoneError:
        return "UTC"


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
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone() -> str:
    """Retrieves the timezone for a web page.

    Returns:
        str: Best match timezone or default to UTC.
    """
    timezone_from_url = request.args.get('timezone')
    if timezone_from_url:
        return validate_timezone(timezone_from_url)

    if g.user and g.user.get('timezone'):
        user_timezone = g.user.get('timezone')
    else:
        None
    if user_timezone:
        return validate_timezone(user_timezone)

    return "UTC"


@app.route('/')
def index() -> str:
    '''default route

    Returns:
        html: homepage
    '''
    return render_template("7-index.html")


if __name__ == "__main__":
    app.run()
