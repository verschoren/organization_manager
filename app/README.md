# Organization Cleanup
## This app will help you clean up your organizations in Zendesk.
Cleanup your Zendesk organizations by removing all users with a non-matching email domain, or by adding users with a matching domain.

## Demo Data
### Avengers
```
curl --location 'https://{subdomain}.zendesk.com/api/v2/users/create_or_update_many' \
--header 'Authorization: Basic {Base64(username:token)}' \
--header 'Content-Type: application/json' \
--data-raw '{"users":[
    {"name":"Iron Man","email":"iron.man@avengers.example","tags":["org_demo"]},
    {"name":"Captain America","email":"captain.america@avengers.example","tags":["org_demo"]},
    {"name":"The Hulk","email":"the.hulk@avengers.example","tags":["org_demo"]},
    {"name":"Spider-Man","email":"spiderman@avengers.example","tags":["org_demo"]},
    {"name":"Black Panther","email":"black.panther@avengers.example","tags":["org_demo"]},
    {"name":"Winter Soldier","email":"winter.soldier@hydra.example","tags":["org_demo"]}
]}'
```

### Seven Dwarfs
```
curl --location 'https://{subdomain}.zendesk.com/api/v2/users/create_or_update_many' \
--header 'Authorization: Basic {Base64(username:token)}' \
--header 'Content-Type: application/json' \
--data-raw '{"users":[
    {"name":"Sleepy","email":"sleepy@sevendwarfs.example","tags":["org_demo"]},
    {"name":"Dopey","email":"dopey@sevendwarfs.example","tags":["org_demo"]},
    {"name":"Doc","email":"doc@sevendwarfs.example","tags":["org_demo"]},
    {"name":"Happy","email":"happy@sevendwarfs.example","tags":["org_demo"]},
    {"name":"Sneezy","email":"sneezy@sevendwarfs.example","tags":["org_demo"]},
    {"name":"Grumpy","email":"grumpy@sevendwarfs.example","tags":["org_demo"]},
    {"name":"Bashful","email":"bashful@sevendwarfs.example","tags":["org_demo"]}
]}'
```