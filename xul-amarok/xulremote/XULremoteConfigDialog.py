# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'XULremoteConfigDialog.ui'
#
# Created: Fri May 12 23:08:59 2006
#      by: The PyQt User Interface Compiler (pyuic) 3.15
#
# WARNING! All changes made in this file will be lost!


from qt import *


class XULremoteConfigDialog(QDialog):
    def __init__(self,parent = None,name = None,modal = 0,fl = 0):
        QDialog.__init__(self,parent,name,modal,fl)

        if not name:
            self.setName("XULremoteConfigDialog")

        self.setMinimumSize(QSize(420,405))

        XULremoteConfigDialogLayout = QGridLayout(self,1,1,8,6,"XULremoteConfigDialogLayout")

        self.titlelabel = QLabel(self,"titlelabel")
        self.titlelabel.setMaximumSize(QSize(32767,30))

        XULremoteConfigDialogLayout.addMultiCellWidget(self.titlelabel,0,0,0,3)

        self.groupBox3 = QGroupBox(self,"groupBox3")
        self.groupBox3.setColumnLayout(0,Qt.Vertical)
        self.groupBox3.layout().setSpacing(6)
        self.groupBox3.layout().setMargin(8)
        groupBox3Layout = QGridLayout(self.groupBox3.layout())
        groupBox3Layout.setAlignment(Qt.AlignTop)

        layout2 = QHBoxLayout(None,0,6,"layout2")

        self.loginlabel = QLabel(self.groupBox3,"loginlabel")
        self.loginlabel.setMinimumSize(QSize(100,0))
        layout2.addWidget(self.loginlabel)

        self.login = QLineEdit(self.groupBox3,"login")
        layout2.addWidget(self.login)

        groupBox3Layout.addLayout(layout2,0,0)

        layout3 = QHBoxLayout(None,0,6,"layout3")

        self.passwdlabel = QLabel(self.groupBox3,"passwdlabel")
        self.passwdlabel.setMinimumSize(QSize(100,0))
        layout3.addWidget(self.passwdlabel)

        self.password = QLineEdit(self.groupBox3,"password")
        self.password.setEchoMode(QLineEdit.Password)
        layout3.addWidget(self.password)

        groupBox3Layout.addLayout(layout3,1,0)

        XULremoteConfigDialogLayout.addMultiCellWidget(self.groupBox3,2,2,0,3)
        spacer6 = QSpacerItem(20,16,QSizePolicy.Minimum,QSizePolicy.Expanding)
        XULremoteConfigDialogLayout.addItem(spacer6,1,0)

        layout9 = QHBoxLayout(None,0,6,"layout9")
        spacer1 = QSpacerItem(391,20,QSizePolicy.Expanding,QSizePolicy.Minimum)
        layout9.addItem(spacer1)

        self.buttonOK = QPushButton(self,"buttonOK")
        layout9.addWidget(self.buttonOK)

        self.buttonCancel = QPushButton(self,"buttonCancel")
        layout9.addWidget(self.buttonCancel)

        XULremoteConfigDialogLayout.addMultiCellLayout(layout9,8,8,0,3)
        spacer4_2 = QSpacerItem(20,60,QSizePolicy.Minimum,QSizePolicy.Expanding)
        XULremoteConfigDialogLayout.addItem(spacer4_2,7,3)

        self.groupBox1 = QGroupBox(self,"groupBox1")
        self.groupBox1.setColumnLayout(0,Qt.Vertical)
        self.groupBox1.layout().setSpacing(6)
        self.groupBox1.layout().setMargin(8)
        groupBox1Layout = QGridLayout(self.groupBox1.layout())
        groupBox1Layout.setAlignment(Qt.AlignTop)

        layout19 = QHBoxLayout(None,0,6,"layout19")

        self.allowedHosts = QListBox(self.groupBox1,"allowedHosts")
        layout19.addWidget(self.allowedHosts)

        layout7 = QVBoxLayout(None,0,6,"layout7")

        self.host = QLineEdit(self.groupBox1,"host")
        layout7.addWidget(self.host)

        self.hostAdd = QPushButton(self.groupBox1,"hostAdd")
        layout7.addWidget(self.hostAdd)

        self.hostRem = QPushButton(self.groupBox1,"hostRem")
        layout7.addWidget(self.hostRem)
        layout19.addLayout(layout7)

        groupBox1Layout.addLayout(layout19,1,0)

        self.textLabel2 = QLabel(self.groupBox1,"textLabel2")
        self.textLabel2.setAlignment(QLabel.WordBreak | QLabel.AlignVCenter)

        groupBox1Layout.addWidget(self.textLabel2,0,0)

        XULremoteConfigDialogLayout.addMultiCellWidget(self.groupBox1,6,6,0,3)
        spacer7 = QSpacerItem(20,41,QSizePolicy.Minimum,QSizePolicy.Expanding)
        XULremoteConfigDialogLayout.addItem(spacer7,5,1)

        self.groupBox2 = QGroupBox(self,"groupBox2")
        self.groupBox2.setColumnLayout(0,Qt.Vertical)
        self.groupBox2.layout().setSpacing(6)
        self.groupBox2.layout().setMargin(8)
        groupBox2Layout = QGridLayout(self.groupBox2.layout())
        groupBox2Layout.setAlignment(Qt.AlignTop)

        self.textLabel1_2 = QLabel(self.groupBox2,"textLabel1_2")

        groupBox2Layout.addWidget(self.textLabel1_2,0,0)

        layout8 = QHBoxLayout(None,0,6,"layout8")

        self.hostlabel = QLabel(self.groupBox2,"hostlabel")
        layout8.addWidget(self.hostlabel)

        self.interface = QLineEdit(self.groupBox2,"interface")
        self.interface.setAlignment(QLineEdit.AlignRight)
        layout8.addWidget(self.interface)

        self.textLabel1 = QLabel(self.groupBox2,"textLabel1")
        layout8.addWidget(self.textLabel1)

        self.port = QLineEdit(self.groupBox2,"port")
        self.port.setMaximumSize(QSize(60,32767))
        self.port.setAlignment(QLineEdit.AlignRight)
        layout8.addWidget(self.port)

        groupBox2Layout.addLayout(layout8,1,0)

        XULremoteConfigDialogLayout.addMultiCellWidget(self.groupBox2,4,4,0,3)
        spacer8 = QSpacerItem(20,31,QSizePolicy.Minimum,QSizePolicy.Expanding)
        XULremoteConfigDialogLayout.addItem(spacer8,3,2)

        self.languageChange()

        self.resize(QSize(430,480).expandedTo(self.minimumSizeHint()))
        self.clearWState(Qt.WState_Polished)

        self.connect(self.buttonOK,SIGNAL("clicked()"),self.accept)
        self.connect(self.buttonCancel,SIGNAL("clicked()"),self.close)
        self.connect(self.hostAdd,SIGNAL("clicked()"),self.addAllowedHost)
        self.connect(self.hostRem,SIGNAL("clicked()"),self.remAllowedHost)

        self.setTabOrder(self.interface,self.port)
        self.setTabOrder(self.port,self.login)
        self.setTabOrder(self.login,self.password)
        self.setTabOrder(self.password,self.buttonOK)
        self.setTabOrder(self.buttonOK,self.buttonCancel)


    def languageChange(self):
        self.setCaption(self.__tr("XUL remote setup"))
        self.titlelabel.setText(self.__tr("<p align=\"center\"><b>XUL remote setup</b></p>"))
        self.groupBox3.setTitle(self.__tr("Authentication"))
        self.loginlabel.setText(self.__tr("Login"))
        self.passwdlabel.setText(self.__tr("Password"))
        self.buttonOK.setText(self.__tr("Ok"))
        self.buttonCancel.setText(self.__tr("Cancel"))
        self.groupBox1.setTitle(self.__tr("Allowed hosts"))
        self.host.setInputMask(QString.null)
        QToolTip.add(self.host,self.__tr("Enter an IP address"))
        self.hostAdd.setText(self.__tr("Add"))
        self.hostRem.setText(self.__tr("Remove"))
        self.textLabel2.setText(self.__tr("<i>Enter the IP addresses of the clients you allow to connect.<br>\n"
"Default: none=any client</i>"))
        self.groupBox2.setTitle(self.__tr("Interface IP"))
        self.textLabel1_2.setText(self.__tr("<i>Enter the IP address of the listening interface<br>\n"
"<b>If you have a direct connection to Internet, enter your LAN IP.</b><br>\n"
"Default: LAN IP, Blank: all interfaces</i>"))
        self.hostlabel.setText(self.__tr("IP"))
        self.interface.setText(QString.null)
        self.interface.setInputMask(QString.null)
        QToolTip.add(self.interface,self.__tr("Enter an IP address"))
        self.textLabel1.setText(self.__tr("Port"))
        self.port.setInputMask(self.__tr("00000; "))


    def addAllowedHost(self):
        print "XULremoteConfigDialog.addAllowedHost(): Not implemented yet"

    def remAllowedHost(self):
        print "XULremoteConfigDialog.remAllowedHost(): Not implemented yet"

    def __tr(self,s,c = None):
        return qApp.translate("XULremoteConfigDialog",s,c)
