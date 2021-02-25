cp app.py backend/Lib/site-packages
cp -R BTS backend/Lib/site-packages


echo "Running app.py"
source backend\Scripts\activate
export FLASK_APP=app.py
flask run
