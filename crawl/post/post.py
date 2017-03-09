import urllib
import urllib2

url = 'http://stackoverflow.com/'

# Prepare the data
values = {'q' : '[python]'}
data = urllib.urlencode(values)

# Send HTTP POST request
req = urllib2.Request(url, data)
response = urllib2.urlopen(req)

html = response.read()

# Print the result
print html