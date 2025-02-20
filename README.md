# Hazard Identification

* As a safety manager I want to increase worker engagement with preventative health and safety measures so that I can improve the health and safety outcomes for the workforce and organisation compliance.
 
* As a safety manager I want to improve the quality of information I receive about reported hazards so I can be more effective in preventing risks on site.

# Usage 

After pulling the repo, run the following: 

```
docker build --no-cache -t lucidplantspace .
```


Running the following will kick off training of the model from the `/data` folder  if you want to train a specific model, download and unzip to this directory.

```
docker run --rm \                                                                      
  -v $(pwd)/data:/app/data \
  -v $(pwd)/models:/app/models \
  lucidplantspace train --data=/app/data/data.yaml --model=yolov8n.pt --epochs=10 --imgsz=640
```

Alternatively to just run the server:

```
docker run -p 8000:8000 lucidplantspace serve
```

Once running, requests can be made via the command line:

```
curl -X 'POST' \                                                  
  'http://localhost:8000/detect/' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@<path_to_image.jpg> '
```

