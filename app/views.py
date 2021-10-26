from flask import render_template, send_from_directory
from flask import request
from flask import Response
from app import app

@app.route('/')
def index():
    return render_template("index.html")




@app.route('/static/js/main.js')
def write_dynamic_js_const():
    api_end_point = app.config['API_END_POINT']
    api_end_point = api_end_point if api_end_point.endswith('/') == False else api_end_point[0:len(api_end_point)-1]
    content = 'const API_END_POINT = "{}";'.format(api_end_point)
    return Response(content, mimetype='application/javascript')





@app.route('/resultado', strict_slashes=False)
@app.route('/resultado/<key_source>', strict_slashes=False)
@app.route('/resultado/<key_source>/<keyword>', strict_slashes=False)
@app.route('/resultado/<key_source>/<keyword>/<zipcode>', strict_slashes=False)
def resultado(key_source='', keyword='', zipcode=''):
    key_source = request.args['key_source'] if 'key_source' in request.args and len(request.args['key_source'])>0 else key_source
    keyword = request.args['keyword'] if 'keyword' in request.args and len(request.args['keyword'])>0 else keyword
    zipcode = request.args['zipcode'] if 'zipcode' in request.args and len(request.args['zipcode'])>0 else zipcode
    page = request.args['page'] if 'page' in request.args else 1
    order_by = request.args['order_by'] if 'order_by' in request.args else ''
    return render_template("resultado.html", source=key_source, keyword=keyword, zipcode=zipcode, page=int(page), order_by=order_by)

