from flask import Flask, render_template, request, json
from flask_sqlalchemy import SQLAlchemy
from club import Club
import sys
import os
import sqlite3

app = Flask(__name__)


# just for test
@app.route('/test/hello', methods=['GET'])
def signin_form():
    return render_template('demo.html')

'''
create a club
e.g：http://127.0.0.1:5000/createClub/1/PKUClub1
'''
@app.route('/createClub/<club_id>/<club_name>', methods=['POST', 'GET'])
def createClub(club_id, club_name):
    Club.createClub(new_id=int(club_id),new_name=club_name,new_description='For test')
    return 'success!'


'''
API:
Function: getClubInfo(club_id) 
Return: {status: ‘’, club_id: ‘’, club_name: ‘’, club_school: ‘’, club_icon: ‘’, club_picture: ‘’, club_info_detail: ‘’, …}

Return in Json format
'''
@app.route('/getClubInfo/<club_id>', methods=['POST', 'GET'])
def getClubInfo(club_id):
    data = Club.getClubInfo(int(club_id))
    if len(data)==0:        # no club found
        status=201
        name=''
        icon=''
        picture=''
        description=''
    else:
        status=200
        name=data[0][1]
        icon=data[0][4]
        picture=data[0][5]
        description=data[0][2]
      
    res = {'status:':status,'club_name': name, 'club_icon':icon,'club_picture':picture,'club_info_detail': description}
    return json.dumps(res)

def initSQL():
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    try:
        cursor.execute('create table clubs (id int, name varchar,description varchar,president varchar,ico varchar,picture varchar)')
    except sqlite3.OperationalError:
        pass

    cursor.close()
    conn.commit()
    conn.close()



if __name__ == '__main__':
    initSQL()
    app.run(debug=True, threaded=True)
