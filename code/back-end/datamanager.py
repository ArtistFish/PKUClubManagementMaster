from enum import Enum
import mysql.connector

# 枚举类型，枚举了DataManager的datatype属性可能具有的值
class DataType(Enum):
    club = 1
    activity = 2
    user = 3
    message = 4

    club_managers = 5
    club_members = 6
    club_activities = 7

    activity_registered_people = 8
    activity_selected_people = 9

# DataManager类，从事数据库访问。使用时，应先根据需要构造实例，指定datatype的值，再调用相关方法。
class DataManager():
    datatype: DataType #指明实例所要处理的是哪方面问题

    def __init__(self, datatype):
        self.datatype = datatype
        self.database_name = 'test_gp10'

    # 获取数据库表某一行的信息，或获取某一个club或activity的附庸信息
    def getInfo(self, id):
        conn = mysql.connector.connect(user = 'root', password = 'root', database = self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("select * from clubs where club_id=%d" % id)
            elif self.datatype == DataType.activity:
                cursor.execute("select * from activities where activity_id=%d" % id)
            elif self.datatype == DataType.user:
                cursor.execute("select * from users where wxid='%s'" % id) #这里应该为wxid，传入的id类型应该是%s
            elif self.datatype == DataType.message:
                cursor.execute("select * from messages where message_id=%d" % id)

            elif self.datatype == DataType.club_managers:
                cursor.execute("select * from club_%d_managers" % id)
            elif self.datatype == DataType.club_members:
                cursor.execute("select * from club_%d_members" % id)
            elif self.datatype == DataType.club_activities:
                cursor.execute("select * from club_%d_activities" % id)

            elif self.datatype == DataType.activity_registered_people:
                cursor.execute("select * from activity_%d_registered_people" % id)
            elif self.datatype == DataType.activity_selected_people:
                cursor.execute("select * from activity_%d_selected_people" % id)
            else:
                pass

        except mysql.connector.errors.ProgrammingError:
            pass

        res = cursor.fetchall()
        cursor.close()
        conn.close()
        return res

    # 获取某一张数据库表的信息
    # 此函数不适用于获取某一club的全部成员或活动，不适用于获取某一activity的成员；这两件事，由getSlaveList函数负责
    def getList(self):
        conn = mysql.connector.connect(user = 'root', password = 'root', database = self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("select * from clubs")
            elif self.datatype == DataType.activity:
                cursor.execute("select * from activities")
            elif self.datatype == DataType.user:
                cursor.execute("select * from users")
            elif self.datatype == DataType.message:
                cursor.execute("select * from messages")
            else:
                pass
        except mysql.connector.errors.ProgrammingError:
            pass

        res = cursor.fetchall()
        cursor.close()
        conn.close()
        return res

    # 获取某一club的全部成员或活动，或获取某一activity的全部成员
    def getSlaveList(self, id):
        conn = mysql.connector.connect(user='root', password='root', database=self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club_managers:
                cursor.execute("select * from club_%d_managers" % id)
            elif self.datatype == DataType.club_members:
                cursor.execute("select * from club_%d_members" % id)
            elif self.datatype == DataType.club_activities:
                cursor.execute("select * from club_%d_activities" % id)

            elif self.datatype == DataType.activity_registered_people:
                cursor.execute("select * from activity_%d_registered_people" % id)
            elif self.datatype == DataType.activity_selected_people:
                cursor.execute("select * from activity_%d_selected_people" % id)
            else:
                pass
        except mysql.connector.errors.ProgrammingError:
            pass

        res = cursor.fetchall()
        cursor.close()
        conn.close()
        return res


    # 为某一张数据库表添加一行记录
    # 要增加一个club，activity，user或message，传入的object应是对应类型的对象
    # 此函数不适用于给某一club增加成员或活动，不适用于给某一activity增加成员；这两件事，由addSlaveInfo函数负责
    def addInfo(self, object):
        conn = mysql.connector.connect(user = 'root', password = 'root', database = self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("insert into clubs (club_name, club_description, club_president_wxid) "
                               "values ('%s','%s', '%s')" % (object.name, object.description, object.president_wxid))
                object.id = cursor.lastrowid # 把得到的自增id赋给对象中的id属性
                # 创建每一个club对应的几个附庸数据表
                cursor.execute("create table club_%d_managers (manager_wxid TINYTEXT primary key)" % object.id)
                cursor.execute("create table club_%d_members (member_wxid TINYTEXT primary key)" % object.id)
                cursor.execute("create table club_%d_activities (activity_id INT primary key)" % object.id)
            elif self.datatype == DataType.activity:
                cursor.execute("insert into activities (activity_name, activity_description, activity_club_id, "
                               "activity_place, "
                               "activity_start_time, activity_end_time, activity_lottery_time, activity_lottery_method,"
                               " activity_max_number) "
                               "values ('%s', '%s', %d, '%s', "
                               "'%s', '%s', '%s', '%s', %d)" % (object.name, object.description, object.clubID,
                                                                object.place,
                                                        object.startTime, object.endTime, object.lotteryTime,
                                                                object.lotteryMethod, object.maxNumber))
                object.id = cursor.lastrowid # 把得到的自增id赋给对象中的id属性
                # 创建每一个activity对应的几个附庸数据表
                cursor.execute("create table activity_%d_registered_people (registered_person_wxid TINYTEXT primary key)"
                               % object.id)
                cursor.execute("create table activity_%d_selected_people (selected_person_wxid TINYTEXT primary key)"
                               % object.id)
            elif self.datatype == DataType.user:
                cursor.execute("insert into users (wxid, user_name) values ('%s', '%s')" % (object.wxid, object.name))
            elif self.datatype == DataType.message:
                cursor.execute("insert into messages (message_type, message_title, message_content, message_sender_wxid,"
                               " message_receiver_wxid) "
                               "values ('%s', '%s', '%s', '%s', '%s')" % (object.type, object.title, object.content,
                                                                          object.sender.wxid, object.receiver.wxid))
                object.id = cursor.lastrowid
            else:
                pass
            conn.commit()
        except mysql.connector.errors.ProgrammingError:
            pass

        cursor.close()
        conn.close()

    # 为某一club增加成员或活动，或给某一activity增加成员
    # id参数是club或activity的id，slave_id是要增加的成员或活动的id（对于成员是wxid）
    def addSlaveInfo(self, id, slave_id):
        conn = mysql.connector.connect(user='root', password='root', database=self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club_managers:
                cursor.execute("insert into club_%d_managers (manager_wxid) values ('%s')" % (id, slave_id))
            elif self.datatype == DataType.club_members:
                cursor.execute("insert into club_%d_members (member_wxid) values ('%s')" % (id, slave_id))
            elif self.datatype == DataType.club_activities:
                cursor.execute("insert into club_%d_activities (activity_id) values (%d)" % (id, slave_id))

            elif self.datatype == DataType.activity_registered_people:
                cursor.execute("insert into activity_%d_registered_people (registered_person_wxid) values ('%s')"
                               % (id, slave_id))
            elif self.datatype == DataType.activity_selected_people:
                cursor.execute("insert into activity_%d_selected_people (selected_person_wxid) values ('%s')"
                               % (id, slave_id))
            else:
                pass
            conn.commit()
        except mysql.connector.errors.ProgrammingError:
            pass

        cursor.close()
        conn.close()

    # 为某一张数据库表删除一行记录
    # 此函数不适用于给某一club删除成员或活动，不适用于给某一activity删除成员；这两件事，由deleteSlaveInfo函数负责
    def deleteInfo(self, id):
        conn = mysql.connector.connect(user = 'root', password = 'root', database = self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("delete from clubs where club_id = %d" % id)
                # 删除这一行记录对应的几个附庸数据表
                cursor.execute("drop table club_%d_managers" % id)
                cursor.execute("drop table club_%d_members" % id)
                cursor.execute("drop table club_%d_activities" % id)
            elif self.datatype == DataType.activity:
                cursor.execute("delete from activities where activity_id = %d" % id)
                # 删除这一行记录对应的几个附庸数据表
                cursor.execute("drop table activity_%d_registered_people" % id)
                cursor.execute("drop table activity_%d_selected_people" % id)
            elif self.datatype == DataType.user:
                cursor.execute("delete from users where wxid = '%s'" % id)
            elif self.datatype == DataType.message:
                cursor.execute("delete from messages where message_id = %d" % id)
            else:
                pass
            conn.commit()
        except mysql.connector.errors.ProgrammingError:
            pass

        cursor.close()
        conn.close()

    # 为某一club删除成员或活动，或给某一activity删除成员
    # id参数是club或activity的id，slave_id是要删除的成员或活动的id（对于成员是wxid）
    def deleteSlaveInfo(self, id, slave_id):
        conn = mysql.connector.connect(user='root', password='root', database=self.database_name)
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club_managers:
                cursor.execute("delete from club_%d_managers where manager_wxid = '%s'" % (id, slave_id))
            elif self.datatype == DataType.club_members:
                cursor.execute("delete from club_%d_members where member_wxid = '%s'" % (id, slave_id))
            elif self.datatype == DataType.club_activities:
                cursor.execute("delete from club_%d_activities where activity_id = %d" % (id, slave_id))

            elif self.datatype == DataType.activity_registered_people:
                cursor.execute("delete from activity_%d_registered_people where registered_person_wxid = '%s'"
                               % (id, slave_id))
            elif self.datatype == DataType.activity_selected_people:
                cursor.execute("delete from activity_%d_selected_people where selected_person_wxid = '%s'"
                               % (id, slave_id))
            else:
                pass
            conn.commit()
        except mysql.connector.errors.ProgrammingError:
            pass

        cursor.close()
        conn.close()