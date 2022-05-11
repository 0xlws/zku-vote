from collections import defaultdict
from bs4 import BeautifulSoup as bs
from pprint import pprint as pp
import requests
import json


headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}
def req(link: str, **kwargs):
    """
    kwargs:
        headers: {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}
        proxy: ''
    
    (function) get: (url: Text | bytes, params: _Params | None = ..., data: Any | None = ..., headers: Any | None = ..., cookies: Any | None = ..., files: Any | None = ..., auth: Any | None = ..., timeout: Any | None = ..., allow_redirects: bool = ..., proxies: Any | None = ..., hooks: Any | None = ..., stream: Any | None = ..., verify: Any | None = ..., cert: Any | None = ..., json: Any | None = ...) -> Response

    """
    assert isinstance(link, str)
    return requests.get(link, headers=headers, **kwargs)

source = req("https://zku.one/final-project-submissions").content
soup = bs(source, "lxml")

article = soup.find("article")
# article = soup.find("article").prettify()

proposals_len = len(article.find_all("h3")) + len(article.find_all("h2"))

h3 = article.find_all("h3")
h2 = article.find_all("h2")
divs = article.find_all("div", {"class":"notion-text"})
imgs = article.find_all("img")
descr = article.find_all("p")

titles = []
for i in range(0, len(h3)):
    title = h3[i].text
    if not "✅" in title:
        continue
    titles.append(title)

for i in range(0, len(h2)):
    title = h2[i].text
    if not "✅" in title:
        continue
    titles.append(title)

info = []
for i in range(0, len(divs)):
    inf = divs[i].text
    d = {}
    if inf == "Note: The project list is not complete and this will be actively updated in coming days. ":
        continue
    if inf == "You can catch up to our next ZKU course: ":
        break
    if inf.startswith("Source Code:") or "github" in inf.lower():
        d["source_code"] = inf
    elif inf.startswith("Website:"):
        d["website"] = inf
    elif inf.startswith("Demo:"):
        d["demo"] = inf
    elif inf.startswith("Discord:"):
        d["discord"] = inf
    else:
        d["info"] = inf
    info.append(d) 

images = []
for i in range(0, len(imgs)):
    img = imgs[i].get("src")
    if "646b9f0a" in img:
        break
    if img.startswith("/_next/"):
        images.append("https://zku.one"+img)

descriptions = []
for i in range(0, len(descr)):
    desc = descr[i].text
    if desc == "Note: The project list is not complete and this will be actively updated in coming days. ":
        continue
    if desc == "You can catch up to our next ZKU course: ":
        break
    # descriptions.append()

# pp(titles)
# pp(info)
with open("../data/submissionsInfo.json", "w") as final:
    json.dump(info, final, indent=2)

with open("../data/submissionsTitles.json", "w") as final:
    json.dump(titles, final, indent=2)

with open("../data/submissionsImages.json", "w") as final:
    json.dump(images, final, indent=2)


# pp(images)
# pp(descriptions)
