# import libraries
import urllib2  
from bs4 import BeautifulSoup  

print "[## JK-DBG-01] idx.py: Begin ===>"
# specify the url
quote_page = 'https://www.bloomberg.com/quote/SPX:IND'  
# query the website and return the html to the variable 'page'
page = urllib2.urlopen(quote_page)  

# parse the html using beautiful soap and store in variable `soup`
soup = BeautifulSoup(page, 'html.parser')  
print "[## JK-DBG-02] soup: %s" %(soup)

# Take out the <div> of name and get its value
name_box = soup.find('h1', attrs={'class': 'name'})  
print "[## JK-DBG-03] name_box: %s" %(name_box)
name = name_box.text.strip() 
# strip() is used to remove starting and trailing  
print name  
print "[## JK-DBG-04] name: %s " %(name)

# get the index price
price_box = soup.find('div', attrs={'class':'price'})  
print "[## JK-DBG-05] price_box: %s" %(price_box)
price = price_box.text  
print price  
print "[## JK-DBG-06] price: %s" %(price)
