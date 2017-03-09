# import libraries
import urllib2  
from bs4 import BeautifulSoup  

result_file = file('web_data.txt','wt')
print "[## JK-DBG-01] idx.py: Begin ===>"
# specify the url
quote_page = 'http://www.sfkorean.com/bbs/board.php?bo_table=logfree&wr_id=40068'  
# query the website and return the html to the variable 'page'
page = urllib2.urlopen(quote_page)  

# parse the html using beautiful soap and store in variable `soup`
soup = BeautifulSoup(page, 'html.parser')  
print "[## JK-DBG-02] soup: %s" %(soup)


# get the index price
bonmun_box = soup.find('div', attrs={'id':'bo_v_con'})  
print "[## JK-DBG-05] bonmun_box: %s" %(bonmun_box)

test = "This is data from WEB pages"
result_file.write(test)
result_file.close()
