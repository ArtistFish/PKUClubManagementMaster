from flask import Flask,render_template,request,json
import sys

app = Flask(__name__)

@app.route('/test/hello', methods=['GET'])
def signin_form():
    return '<h1>Hello World!</h1>'


@app.route('/test/<id>',methods=['POST'])
def id_form(id):
    return 'Hello %s!' % id


# an example of serving for front-end 
@app.route('/FromFrontEnd',methods=['POST'])
def FromFrontEnd():
    data=int(json.loads(request.values.get("xxx")))
    res=data 
    return json.dumps(res.decode('utf8'))

if __name__ == '__main__':
    app.run(debug=True)