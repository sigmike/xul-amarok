# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'XULremoteConfigDialog.ui'
#
# Created: Sat Feb 18 17:53:38 2006
#      by: The PyQt User Interface Compiler (pyuic) 3.15
#
# WARNING! All changes made in this file will be lost!


from qt import *


class XULremoteConfigDialog(QDialog):
    def __init__(self,parent = None,name = None,modal = 0,fl = 0):
        QDialog.__init__(self,parent,name,modal,fl)

        if not name:
            self.setName("XULremoteConfigDialog")


        XULremoteConfigDialogLayout = QVBoxLayout(self,8,6,"XULremoteConfigDialogLayout")

        self.titlelabel = QLabel(self,"titlelabel")
        self.titlelabel.setMaximumSize(QSize(32767,30))
        XULremoteConfigDialogLayout.addWidget(self.titlelabel)

        layout6 = QHBoxLayout(None,0,6,"layout6")

        self.hostlabel = QLabel(self,"hostlabel")
        self.hostlabel.setMinimumSize(QSize(100,0))
        layout6.addWidget(self.hostlabel)

        self.interface = QLineEdit(self,"interface")
        self.interface.setAlignment(QLineEdit.AlignRight)
        layout6.addWidget(self.interface)

        self.port = QLineEdit(self,"port")
        self.port.setMaximumSize(QSize(60,32767))
        self.port.setAlignment(QLineEdit.AlignRight)
        layout6.addWidget(self.port)
        XULremoteConfigDialogLayout.addLayout(layout6)

        layout2 = QHBoxLayout(None,0,6,"layout2")

        self.loginlabel = QLabel(self,"loginlabel")
        self.loginlabel.setMinimumSize(QSize(100,0))
        layout2.addWidget(self.loginlabel)

        self.login = QLineEdit(self,"login")
        layout2.addWidget(self.login)
        XULremoteConfigDialogLayout.addLayout(layout2)

        layout3 = QHBoxLayout(None,0,6,"layout3")

        self.passwdlabel = QLabel(self,"passwdlabel")
        self.passwdlabel.setMinimumSize(QSize(100,0))
        layout3.addWidget(self.passwdlabel)

        self.password = QLineEdit(self,"password")
        self.password.setEchoMode(QLineEdit.Password)
        layout3.addWidget(self.password)
        XULremoteConfigDialogLayout.addLayout(layout3)

        layout7 = QHBoxLayout(None,0,6,"layout7")
        spacer1 = QSpacerItem(60,20,QSizePolicy.Expanding,QSizePolicy.Minimum)
        layout7.addItem(spacer1)

        self.buttonOK = QPushButton(self,"buttonOK")
        layout7.addWidget(self.buttonOK)

        self.buttonCancel = QPushButton(self,"buttonCancel")
        layout7.addWidget(self.buttonCancel)
        XULremoteConfigDialogLayout.addLayout(layout7)

        self.languageChange()

        self.resize(QSize(296,158).expandedTo(self.minimumSizeHint()))
        self.clearWState(Qt.WState_Polished)

        self.connect(self.buttonOK,SIGNAL("clicked()"),self.accept)
        self.connect(self.buttonCancel,SIGNAL("clicked()"),self.close)

        self.setTabOrder(self.interface,self.port)
        self.setTabOrder(self.port,self.login)
        self.setTabOrder(self.login,self.password)
        self.setTabOrder(self.password,self.buttonOK)
        self.setTabOrder(self.buttonOK,self.buttonCancel)


    def languageChange(self):
        self.setCaption(self.__tr("XUL remote setup"))
        self.titlelabel.setText(self.__tr("<p align=\"center\"><b>XUL remote setup</b></p>"))
        self.hostlabel.setText(self.__tr("Interface / port"))
        self.interface.setText(QString.null)
        self.interface.setInputMask(QString.null)
        self.port.setInputMask(self.__tr("00000; "))
        self.loginlabel.setText(self.__tr("Login"))
        self.passwdlabel.setText(self.__tr("Password"))
        self.buttonOK.setText(self.__tr("Ok"))
        self.buttonCancel.setText(self.__tr("Cancel"))


    def __tr(self,s,c = None):
        return qApp.translate("XULremoteConfigDialog",s,c)
