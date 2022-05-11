import requests
import json
with open("../data/submissionsImages.json", 'r') as data:
    imageUrls = json.load(data)

img_paths = []
n=0
for i, _ in enumerate(range(0,24)):
    if i in set((1,3,5,7,8,9,13,14,15,18,19,20,23,24)):
        i+=1
        continue
    img = requests.get(imageUrls[n]).content
    with open(f"../../../public/images/img_{i}.png", "wb") as data:
        data.write(img)
    img_paths.append(f"../public/images/img_{i}.png")
    n+=1
    
with open("../data/images.json", "w") as data:
    json.dump(img_paths, data, indent=2)

# imports = []
# imports = ""
# exports = ""
# text = ""
# for i, path in enumerate(img_paths):
#     imports += f'import img_{i} from "{path}";\n'
#     exports += f"\timg_{i},\n"
#     export_line = "export {\n" + exports + "};"
    
# text += imports + export_line
    
    # imports.append(text)
# with open("../data/images.tsx", "w") as data:
#     data.write(text)