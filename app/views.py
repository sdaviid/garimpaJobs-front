from flask import render_template
from flask import request

from app import app

@app.route('/')
def index():
    return render_template("teste.html")


# @app.route('/resultado')




@app.route('/resultado/<source>/<vaga>/<cep>')
def resultado(source, vaga, cep):
    page = request.args['page'] if 'page' in request.args else 1
    return render_template("resultado.html", source=source, vaga=vaga, cep=cep, pagina=int(page))



    # path('', views.index, name='index'),
    #     path('resultado/<str:vaga>/<str:cep>/<str:source>', views.detail, name='detail'),
    #     path('resultado/<str:vaga>/<str:cep>/<str:source>/<int:pagina>', views.detail, name='detail'),

# @app.route('/about/')
# def about():
#     return render_template("teste.html")