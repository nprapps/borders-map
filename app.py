#!/usr/bin/env python

import argparse
from flask import Flask, render_template

import app_config
from render_utils import make_context, urlencode_filter
import static

app = Flask(app_config.PROJECT_NAME)

app.jinja_env.filters['urlencode'] = urlencode_filter

# Example application views
@app.route('/')
def index():
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context()

    # Nav needs to be a list of lists.
    # The inner list should only have four objects max.
    # Because of reasons.
    context['nav'] = []
    contents = list(context['COPY']['content'])
    not_yet_four = []

    for idx, row in enumerate(contents):
        row = dict(zip(row.__dict__['_columns'], row.__dict__['_row']))
        row_title = row.get('data_panel', None)

        if row_title:
            if row_title not in ['_', 'introduction', 'data_panel', 'about']:
                not_yet_four.append(row)

                if len(not_yet_four) == 4:
                    context['nav'].append(not_yet_four)
                    not_yet_four = []

        if (idx + 1) == len(contents):
            if len(not_yet_four) > 0:
                context['nav'].append(not_yet_four)

    return render_template('index.html', **context)

app.register_blueprint(static.static)

# Boilerplate
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port')
    args = parser.parse_args()
    server_port = 8000

    if args.port:
        server_port = int(args.port)

    app.run(host='0.0.0.0', port=server_port, debug=app_config.DEBUG)
