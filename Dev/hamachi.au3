#RequireAdmin
$CMD = "start hamachi.msi"
RunWait(@ComSpec & " /c " & $CMD)
WinWaitActive('LogMeIn Hamachi Setup', 'Choose your preferred language')
ControlClick('LogMeIn Hamachi Setup', 'Choose your preferred language', 'Button1')
WinWaitActive('LogMeIn Hamachi Setup', 'I have read and agree to the terms of the License Agreement')
ControlCommand('LogMeIn Hamachi Setup', 'I have read and agree to the terms of the License Agreement', 'Button5', 'Check')
ControlClick('LogMeIn Hamachi Setup', 'I have read and agree to the terms of the License Agreement', 'Button1')
WinWaitActive('LogMeIn Hamachi Setup', 'Create Shortcut on the Desktop')
ControlCommand('LogMeIn Hamachi Setup', 'Create Shortcut on the Desktop', 'Button6', 'Check')
ControlClick('LogMeIn Hamachi Setup', 'Create Shortcut on the Desktop', 'Button2')
WinWaitActive('LogMeIn Hamachi Setup', 'LogMeIn Hamachi Setup Complete')
ControlCommand('LogMeIn Hamachi Setup', 'LogMeIn Hamachi Setup Complete', 'Button4', 'Check')
ControlClick('LogMeIn Hamachi Setup', 'LogMeIn Hamachi Setup Complete', 'Button1')
