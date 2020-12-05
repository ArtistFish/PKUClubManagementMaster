from flask import Flask, render_template, request, json
from club import Club
from datamanager import *


app = Flask(__name__)


# for test
@app.route("/gp10",methods=['GET'])
def test_form():
    return "response from SE group 10"

'''
API:
create a club
'''
@app.route('/gp10/createClub_test/<club_name>', methods=['POST', 'GET'])
def createClub_test(club_name):
    club_president_wxid='0x1'
    club_description='description for test'
    club=Club(club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid)
    manager=DataManager(DataType.club)
    manager.addInfo(club)

    res={'status':'200 OK'}
    return json.dumps(res)

@app.route('/gp10/createClub', methods=['POST'])
def createClub():
    club_name= str(json.loads(request.values.get("club_name")))
    club_description=str(json.loads(request.values.get("club_description")))
    club_president_wxid=int(json.loads(request.values.get("club_president_user_id")))

    club=Club(club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid)
    manager=DataManager(DataType.club)
    manager.addInfo(club)

    res={'status':'200 OK'}
    return json.dumps(res)



'''
API:
Function: getClubInfo(club_id) 
Return: {'status':status,'club_name': club_name, 'club_description':club_description,'club_president_user_id',club_president_user_id}

Return in Json format
'''
@app.route('/gp10/getClubInfo_test/<club_id>', methods=['POST', 'GET'])
def getClubInfo_test(club_id):
    club_id=int(club_id)
    manager=DataManager(DataType.club)
    club_info=manager.getInfo(club_id)
    if len(club_info)==0:
        return json.dumps({'status:':'Not Found'})
    club=Club(club_id=club_id,club_name=club_info[0][1],club_description=club_info[0][2],club_president_wxid=club_info[0][3])
    res=club.Jsonfy()
    return res

@app.route('/gp10/getClubInfo', methods=['POST'])
def getClubInfo():
    club_id= int(json.loads(request.values.get("club_id")))
    manager=DataManager(DataType.club)
    club_info=manager.getInfo(club_id)
    if len(club_info)==0:
        return json.dumps({'status:':'Not Found'})
    club=Club(club_id=club_id,club_name=club_info[0][1],club_description=club_info[0][2],club_president_wxid=club_info[0][3])
    res=club.Jsonfy()
    return res



if __name__ == '__main__':
    app.run(debug=True, threaded=True,host='0.0.0.0')
