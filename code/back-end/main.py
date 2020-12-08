from flask import Flask, render_template, request, json
from club import Club
from datamanager import *
from message import *


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

'''
API:setClubInfo
'''
app.route('/gp10/setClubInfo', methods=['POST'])
def setClubInfo():
    club_id= int(json.loads(request.values.get("club_id")))
    club_name= str(json.loads(request.values.get("club_name")))
    club_description=str(json.loads(request.values.get("club_description")))
    club_president_wxid=int(json.loads(request.values.get("club_president_user_id")))
    club=Club(club_id=club_id,club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid)
    manager=DataManager(DataType.club)
    manager.updateInfo(club)
    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:getClubList
'''

@app.route('/gp10/getClubList', methods=['POST','GET'])
def getClubList():
    manager=DataManager(DataType.club)
    res=manager.getList()
    club_list=[]
    for club in res:
        club_list.append((club[0],club[1]))
    return json.dumps({'status':'200 OK','club_list':club_list})

'''
API:getRelatedClubList
输入关键字keyword，返回相关的社团
'''

@app.route('/gp10/getRelatedClubList', methods=['POST'])
def getRelatedClubList():
    keyword = str(json.loads(request.values.get("keyword")))
    manager=DataManager(DataType.club)
    res=manager.getList()
    related_club_list=[]
    for club in res:
        if keyword in club[1] or keyword in club[2]:
            related_club_list.append((club[0],club[1]))
    return json.dumps({'status':'200 OK','related_club_list':related_club_list})
    



'''
API:
Function: sendMessage(wx_id_sender, wx_id_receiver, type, title, content)
Return: {'status': status}
'''
@app.route('/gp10/sendMessage', methods = ['POST'])
def sendMessage():
    message_type = str(json.loads(request.values.get("type")))
    message_title = str(json.loads(request.values.get("title")))
    message_content = str(json.loads(request.values.get("content")))
    message_sender_wxid = str(json.loads(request.values.get("wx_id_sender")))
    message_receiver_wxid = str(json.loads(request.values.get("wx_id_receiver")))
    message = Message(message_type=message_type, message_title=message_title, message_content=message_content,
                      message_sender_wxid=message_sender_wxid, message_receiver_wxid=message_receiver_wxid)
    manager = DataManager(DataType.message)
    manager.addInfo(message)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:
Function: getMessages(wx_id)
Return: {status: ‘’, send_message_list: [ {id: '', type: ‘’, title: ‘’, content: ‘’, sender: ‘’, receiver: ‘’} , …], 
    receive_message_list: [ {id: '', type: ‘’, title: ‘’, content: ‘’, sender: ‘’, receiver: ‘’} , …]}
其中send_message_list包含该wx_id发出的信息，receive_message_list包含该wx_id收到的信息

Return in JSON format
'''
@app.route('/gp10/getMessage', methods = ['POST'])
def getMessages():
    wxid = str(json.loads(request.values.get("wx_id")))
    message_list_of_user = MessageListOfUser(wxid=wxid)
    return json.dumps(message_list_of_user)


if __name__ == '__main__':
    app.run(debug=True, threaded=True,host='0.0.0.0',port=5000)
