# # Copyright 2018 Google LLC
# #
# # Licensed under the Apache License, Version 2.0 (the "License");
# # you may not use this file except in compliance with the License.
# # You may obtain a copy of the License at
# #
# #     http://www.apache.org/licenses/LICENSE-2.0
# #
# # Unless required by applicable law or agreed to in writing, software
# # distributed under the License is distributed on an "AS IS" BASIS,
# # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# # See the License for the specific language governing permissions and
# # limitations under the License.

# # [START gae_python38_app]
# # [START gae_python3_app]
# from urllib import request
# from flask import Flask


# # If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# # called `app` in `main.py`.
# app = Flask(__name__)


# @app.route('/')
# def hello():
#     """Return a friendly HTTP greeting."""
#     return 'Hello World!'


# if __name__ == '__main__':
#     # This is used when running locally only. When deploying to Google App
#     # Engine, a webserver process such as Gunicorn will serve the app. You
#     # can configure startup instructions by adding `entrypoint` to app.yaml.
#     app.run(host='127.0.0.1', port=8080, debug=True)
# # [END gae_python3_app]
# # [END gae_python38_app]

from cgi import test
from crypt import methods
from sqlite3 import Date
from flask import Flask
from flask import request
import requests
from datetime import *
from dateutil.relativedelta import *

app = Flask(__name__)

API_KEY = 'c7qaj5qad3i9it664ej0'


@app.route('/')
def homepage():
    return app.send_static_file('index.html')


@app.route('/company')
def returnCompanyDetails():
    param1 = request.args.get('param1')
    url = 'https://finnhub.io/api/v1/stock/profile2?symbol={0}&token={1}'.format(
        param1, API_KEY)
    response = requests.get(url)
    return response.json()


@app.route('/stocksummary')
def returnStockSummary():
    param1 = request.args.get('param1')
    url = 'https://finnhub.io/api/v1/quote?symbol={0}&token={1}'.format(
        param1, API_KEY)
    response = requests.get(url)
    return response.json()


@app.route('/recommendationtrends')
def returnRecommendationTrends():
    param1 = request.args.get('param1')
    url = 'https://finnhub.io/api/v1/stock/recommendation?symbol={0}&token={1}'.format(
        param1, API_KEY)
    response = requests.get(url)
    lst = response.json()
    if len(lst) != 0:
        lst[0]["exists"] = "true"
        return lst[0]
    else:
        return {"buy": "", "hold": "", "sell": "", "strongBuy": "", "strongSell": ""}


@app.route('/charts')
def returnChartData():
    param1 = request.args.get('param1')

    currentTime = datetime.now()
    toTimestamp = int(currentTime.timestamp())
    startTime = currentTime + relativedelta(months=-6, days=-1)
    fromTimestamp = int(startTime.timestamp())

    # print(toTimestamp)
    # print(fromTimestamp)
    # print("currentTime", currentTime)
    # print("startTime", startTime)

    url = 'https://finnhub.io/api/v1/stock/candle?symbol={0}&resolution=D&from={1}&to={2}&token={3}'.format(
        param1, fromTimestamp, toTimestamp, API_KEY)

    response = requests.get(url)

    # respJson = response.json()
    # respJson["fromDate"] = str(startTime)[:10]
    # return respJson

    return response.json()


@app.route('/latestnews')
def returnLatestNews():
    param1 = request.args.get('param1')
    currentDate = date.today()
    currentDateStr = str(currentDate.year) + "-" + '{:02d}'.format(
        currentDate.month) + "-" + '{:02d}'.format(currentDate.day)
    fromDate = currentDate + relativedelta(months=-1)
    fromDateStr = str(fromDate.year) + "-" + '{:02d}'.format(
        fromDate.month) + "-" + '{:02d}'.format(fromDate.day)
    url = 'https://finnhub.io/api/v1/company-news?symbol={0}&from={1}&to={2}&token={3}'.format(
        param1, fromDateStr, currentDateStr, API_KEY)
    response = requests.get(url)
    lst = response.json()
    dic = {}
    articleNumber = 0
    for i in range(len(lst)):
        if articleNumber < 5:
            if (lst[i]["image"] != "") and (lst[i]["headline"] != "") and (lst[i]["datetime"] != '' or lst[i]["datetime"] != None or lst[i]["datetime"] != 0) and (lst[i]["url"] != ''):
                dic[articleNumber] = lst[i]
                articleNumber += 1
    return dic


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
