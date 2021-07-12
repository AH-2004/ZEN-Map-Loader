#RequireAdmin
#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Icon=Bakkes.ico
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****
$CMD = "start BakkesModSetup.exe"
RunWait(@ComSpec & " /c " & $CMD)

AutoItSetOption('WinTextMatchMode', 2)
WinWaitActive('Setup', 'To continue, this installer will close any open instances of Rocket League and BakkesMod.')
ControlClick('Setup', 'To continue, this installer will close any open instances of Rocket League and BakkesMod.', 'Button1')
WinWaitActive('Setup - BakkesMod', 'Select Destination Location')
ControlClick('Setup - BakkesMod', 'Select Destination Location', 'TNewButton2')
WinWaitActive('Setup - BakkesMod', 'Select the additional tasks you would like Setup to perform while installing BakkesMod, then click Next.')
ControlCommand('Setup - BakkesMod', 'Select the additional tasks you would like Setup to perform while installing BakkesMod, then click Next.', 'TNewCheckListBox1', 'Check')
ControlClick('Setup - BakkesMod', 'Select the additional tasks you would like Setup to perform while installing BakkesMod, then click Next.', 'TNewButton3')
ControlClick('Setup - BakkesMod', 'Setup is now ready to begin installing BakkesMod on your computer.', 'TNewButton3')
WinWaitActive('Setup', 'BakkesMod is now installed! If you are running into issues, you may need to whitelist it in your AntiVirus.')
ControlClick('Setup', 'BakkesMod is now installed! If you are running into issues, you may need to whitelist it in your AntiVirus.', 'Button2')
WinWaitActive('Setup - BakkesMod', 'Setup has finished installing BakkesMod on your computer. The application may be launched by selecting the installed shortcuts.')
ControlCommand('Setup - BakkesMod', 'Select the additional tasks you would like Setup to perform while installing BakkesMod, then click Next.', 'TNewCheckListBox1', 'Check')
ControlClick('Setup - BakkesMod', 'Setup has finished installing BakkesMod on your computer. The application may be launched by selecting the installed shortcuts.', 'TNewButton3')

