copy /y app.py backend\Lib\site-packages
xcopy BTS backend\Lib\site-packages\BTS /s/e/y/d/i



echo Running app.py
call backend\Scripts\activate
set FLASK_APP=app.py
start "" "http://127.0.0.1:5000"
flask run
