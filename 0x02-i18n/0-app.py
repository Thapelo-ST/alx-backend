#!/usr/bin/env python3
""" displays welcome to holberton """
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/', strict_slashes=False)
def hello():
    """ function for displaying welcome to holberton """
    return render_template('/template/0-index.html')


if __name__ == '__main__':
    app.run()
