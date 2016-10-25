import os
import re
import requests
from bs4 import BeautifulSoup

url_onePage = 'http://www.assembly.go.kr/assm/memact/congressman/memCond/memCondListAjax.do'
url = 'http://www.assembly.go.kr/assm/memact/congressman/memCond/memCondListAjax.do?currentPage=1&rowPerPage=1000'

html = requests.get(url).text
soup = BeautifulSoup(html)
count = 0
for member_tag in soup.select('.memberna_list dl dt a'):
	name = member_tag.text
	link = member_tag['href']

	count = count+1
	matched = re.search(r'\d+', link)
	if matched:
		member_id = matched.group(0)
	else:
		member_id = None

	print "[%d] name=%s : member_id= %s" %(count, name, member_id)
