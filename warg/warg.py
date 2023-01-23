
from time import sleep
import requests
import logging
import os

os.environ['no_proxy'] = '*'

logging.basicConfig(format='%(asctime)s: %(message)s')

BASE_URL = 'https://warg.devsecops.<REPLACE>'

class Client(object):
    def __init__(self, username=None,
            password=None, token=None):
        self.url = BASE_URL
        self.session = requests.Session()

        if token:
            self.session.headers = {'Authorization': f'Bearer {token}'}
        else:
            self.session.auth = (username, password)

    def warg(self, service, data, files=None, wait=10):
        url = f'{self.url}/api/{service}/'

        if files:
            warg = self.session.post(url, data=data, files=files).json()
        else:
            warg = self.session.post(url, json=data).json()

        logging.warning('WARG %s', warg)

        while True:
            response = self.session.get(f'{url}{warg["number"]}/')

            logging.warning('GET %s', response.url)

            if response.status_code == 200:
                return response.content

            elif response.json()['detail'] != 'Scan still in progress.':
                return response.json()

            sleep(wait) # in seconds

def get_token(username, password):
    url = f'{BASE_URL}/api/token/'
    return requests.post(url, json={
        'username': username, 'password': password}).json()

def refresh_token(token):
    url = f'{BASE_URL}/api/token/refresh/'
    return requests.post(url, json={'refresh': token}).json()
