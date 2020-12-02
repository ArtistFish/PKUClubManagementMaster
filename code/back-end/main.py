from flask import Flask, render_template, request, json
import mysql.connector
from club import Club
import sys
import os


app = Flask(__name__)


# just for test
@app.route("/gp10",methods=['GET'])
def testc_form():
    return "response from SE group 10"

'''
API:
create a club
'''
@app.route('/gp10/createClub_test/<club_id>/<club_name>', methods=['POST', 'GET'])
def createClub_test(club_id, club_name):
    res=Club.createClub(club_id=int(club_id),club_name=club_name,club_description='For test')
    if res==0:
        status='success'
    else:
        status='failed'
    res={'status':status}
    return json.dumps(res)

@app.route('/gp10/createClub', methods=['POST'])
def createClub():
    club_id= int(json.loads(request.values.get("club_id")))
    club_name= str(json.loads(request.values.get("club_name")))
    club_description=str(json.loads(request.values.get("club_description")))
    club_president_user_id=int(json.loads(request.values.get("club_president_user_id")))

    res=Club.createClub(club_id,club_name,club_description,club_president_user_id)
    if res==0:
        status='success'
    else:
        status='failed'
    res={'status':status}
    return json.dumps(res)



'''
API:
Function: getClubInfo(club_id) 
Return: {'status':status,'club_name': club_name, 'club_description':club_description,'club_president_user_id',club_president_user_id}

Return in Json format
'''
@app.route('/gp10/getClubInfo_test/<club_id>', methods=['POST', 'GET'])
def getClubInfo_test(club_id):
    data = Club.getClubInfo(int(club_id))
    if len(data)==0:        # no club found
        status='failed'
        club_name=''
        club_description=''
        club_president_user_id=-1
    else:
        status='success'
        club_name=data[0][1]
        club_description=data[0][2]
        club_president_user_id=data[0][3]
    res = {'status':status,'club_name': club_name, 'club_description':club_description,'club_president_user_id':club_president_user_id}
    return json.dumps(res)

@app.route('/gp10/getClubInfo', methods=['POST'])
def getClubInfo():
    club_id= int(json.loads(request.values.get("club_id")))
    data = Club.getClubInfo(int(club_id))
    if len(data)==0:        # no club found
        status='failed'
        club_name=''
        club_description=''
        club_president_user_id=-1
    else:
        status='success'
        club_name=data[0][1]
        club_description=data[0][2]
        club_president_user_id=data[0][3]
    res = {'status':status,'club_name': club_name, 'club_description':club_description,'club_president_user_id':club_president_user_id}
    return json.dumps(res)

def initSQL():
    conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
    cursor = conn.cursor()

        
    try:
        cursor.execute('create table users (user_id INT primary key,user_name TINYTEXT)')
    except mysql.connector.errors.ProgrammingError:                     #table already exist
        pass

    try:
        cursor.execute('create table clubs (club_id INT primary key, club_name TINYTEXT,club_description TEXT,club_president_user_id INT)')
    except mysql.connector.errors.ProgrammingError:
        pass

    try:
        cursor.execute('create table activities (activity_id INT primary key, activity_name TINYTEXT,activity_description TEXT,activity_club_id INT,activity_place TEXT,activity_start_time DATETIME,activity_end_time DATETIME,activity_lottery_time DATETIME,activity_lottery_method TINYTEXT,activity_max_number INT)')
    except mysql.connector.errors.ProgrammingError:
        pass

    try:
        cursor.execute('create table messages (message_id INT primary key,message_type TINYTEXT,message_title TINYTEXT,message_content TEXT,message_sender_user_id INT,message_receiver_user_id INT)')
    except mysql.connector.errors.ProgrammingError:
        pass

    cursor.close()
    conn.commit()
    conn.close()



if __name__ == '__main__':
    initSQL()
    app.run(debug=True, threaded=True,host='0.0.0.0')
