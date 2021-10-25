from flask import render_template, send_from_directory
from flask import request
from flask import Response
from app import app

@app.route('/')
def index():
    return render_template("teste.html")


@app.route('/kk')
def ee():
    return render_template("opaopa.html")





@app.route('/static/js/main.js')
def write_dynamic_js_const():
    api_end_point = app.config['API_END_POINT']
    api_end_point = api_end_point if api_end_point.endswith('/') == False else api_end_point[0:len(api_end_point)-1]
    content = 'const API_END_POINT = "{}";'.format(api_end_point)
    return Response(content, mimetype='application/javascript')






@app.route('/resultado/<source>', strict_slashes=False)
@app.route('/resultado/<source>/<vaga>', strict_slashes=False)
@app.route('/resultado/<source>/<vaga>/<cep>', strict_slashes=False)
def resultado(source, vaga='', cep=''):
    vaga = request.args['keyword'] if 'keyword' in request.args and len(request.args['keyword'])>0 else vaga
    cep = request.args['zipcode'] if 'zipcode' in request.args and len(request.args['zipcode'])>0 else cep
    page = request.args['page'] if 'page' in request.args else 1
    return render_template("resultado.html", source=source, vaga=vaga, cep=cep, pagina=int(page))



    # path('', views.index, name='index'),
    #     path('resultado/<str:vaga>/<str:cep>/<str:source>', views.detail, name='detail'),
    #     path('resultado/<str:vaga>/<str:cep>/<str:source>/<int:pagina>', views.detail, name='detail'),

# @app.route('/about/')
# def about():
#     return render_template("teste.html")