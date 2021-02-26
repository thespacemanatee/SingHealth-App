copy /y app.py backend\Lib\site-packages
xcopy BTS backend\Lib\site-packages\BTS /s/e/y/d/i



echo Running app.py
call backend\Scripts\activate
set FLASK_APP=app.py
flask run
