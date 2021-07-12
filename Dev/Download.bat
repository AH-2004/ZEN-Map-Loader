@echo off

powershell -Command "Invoke-WebRequest -Uri 'https://github.com/bakkesmodorg/BakkesModInjectorCpp/releases/latest/download/BakkesModSetup.zip' -OutFile 'bakkes.zip'"
powershell -Command "expand-archive -path '.\bakkes.zip' -destinationpath 'bakkes'"
del bakkes.zip
cd bakkes
move "BakkesModSetup.exe" ".."
cd ..
rmdir bakkes