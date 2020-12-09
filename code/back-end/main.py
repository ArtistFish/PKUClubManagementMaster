from flask import Flask, render_template, request, json
from club import Club
from datamanager import *
from message import *
from user import *

app = Flask(__name__)

# for test
@app.route("/gp10",methods=['GET'])
def test_form():
    return "response from SE group 10"

'''
API:
create a user (用户注册)
'''
@app.route('/gp10/createUser', methods=['POST'])
def createUser():
    wxid = request.form.get("wx_id")
    name = request.form.get("user_name")
    datamanager = DataManager(DataType.user)
    user = User(wxid=wxid, name=name)
    datamanager.addInfo(user)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:
create a club
'''
@app.route('/gp10/createClub', methods=['POST'])
def createClub():
    club_name = request.form.get("club_name")
    club_description = request.form.get("club_description")
    club_president_wxid = request.form.get("club_president_user_id")

    club=Club(club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid)
    manager=DataManager(DataType.club)
    manager.addInfo(club)

    res={'status':'200 OK'}
    return json.dumps(res)

'''
API:
delete a club
'''
@app.route('/gp10/deleteClub', methods=['POST'])
def deleteClub():
    club_id = int(request.form.get("club_id"))
    manager = DataManager(DataType.club)
    manager.deleteInfo(club_id)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:
Function: getClubInfo(club_id) 
Return: {'status':status,'club_name': club_name, 'club_description':club_description,'club_president_user_id',club_president_user_id}

Return in Json format
'''
@app.route('/gp10/getClubInfo', methods=['POST'])
def getClubInfo():
    club_id = int(request.form.get("club_id"))
    manager=DataManager(DataType.club)
    club_info=manager.getInfo(club_id)
    if len(club_info)==0:
        return json.dumps({'status:':'Not Found'})
    club=Club(club_id=club_id,club_name=club_info[0][1],club_description=club_info[0][2],club_president_wxid=club_info[0][3])
    res=club.Jsonfy()
    return res

'''
API: getClubManagers
获取社团骨干列表
'''
@app.route('/gp10/getClubManagers', methods = ['POST'])
def getClubManagers():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_managers)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_manager_list': res})

'''
API: getClubMembers
获取社团成员列表
'''
@app.route('/gp10/getClubMembers', methods = ['POST'])
def getClubMembers():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_members)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_member_list': res})

'''
API: getClubActivities
获取社团活动列表
'''
@app.route('/gp10/getClubActivities', methods = ['POST'])
def getClubActivities():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_activities)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_activity_list': res})

'''
API: addManagerToClub
向社团增加骨干
'''
@app.route('/gp10/addManagerToClub', methods = ['POST'])
def addManagerToClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_managers)
    datamanager.addSlaveInfo(club_id, wxid)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API: addMemberToClub
向社团增加成员
'''
@app.route('/gp10/addMemberToClub', methods = ['POST'])
def addMemberToClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_members)
    datamanager.addSlaveInfo(club_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: addActivityToClub
向社团增加活动
'''
@app.route('/gp10/addActivityToClub', methods = ['POST'])
def addActivityToClub():
    club_id = int(request.form.get("club_id"))
    activity_id = int(request.form.get("activity_id"))
    datamanager = DataManager(DataType.club_activities)
    datamanager.addSlaveInfo(club_id, activity_id)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API: deleteManagerFromClub
从社团删除骨干
'''
@app.route('/gp10/deleteManagerFromClub', methods = ['POST'])
def deleteManagerFromClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_managers)
    datamanager.deleteSlaveInfo(club_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: deleteMemberFromClub
从社团删除成员
'''
@app.route('/gp10/deleteMemberFromClub', methods = ['POST'])
def deleteMemberFromClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_members)
    datamanager.deleteSlaveInfo(club_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: deleteActivityFromClub
从社团删除活动
'''
@app.route('/gp10/deleteActivityFromClub', methods = ['POST'])
def deleteActivityFromClub():
    club_id = int(request.form.get("club_id"))
    activity_id = int(request.form.get("activity_id"))
    datamanager = DataManager(DataType.club_activities)
    datamanager.deleteSlaveInfo(club_id, activity_id)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API:setClubInfo
设定社团信息
'''
@app.route('/gp10/setClubInfo', methods=['POST'])
def setClubInfo():
    club_id = int(request.form.get("club_id"))
    club_name = request.form.get("club_name")
    club_description = request.form.get("club_description")
    club_president_wxid = request.form.get("club_president_user_id")
    club=Club(club_id=club_id,club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid)
    manager=DataManager(DataType.club)
    manager.updateInfo(club)
    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:getClubList
获取社团列表
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
    keyword = request.form.get("keyword")
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
    message_type = request.form.get("type")
    message_title = request.form.get("title")
    message_content = request.form.get("content")
    message_sender_wxid = request.form.get("wx_id_sender")
    message_receiver_wxid = request.form.get("wx_id_receiver")
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
@app.route('/gp10/getMessages', methods = ['POST'])
def getMessages():
    wxid = request.form.get("wx_id")
    message_list_of_user = MessageListOfUser(wxid=wxid)
    return json.dumps(message_list_of_user.__dict__)


if __name__ == '__main__':
    app.run(debug=True, threaded=True,host='0.0.0.0',port=5000)
