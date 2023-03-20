![Apple TV 4K Copy 25@0 5x](https://user-images.githubusercontent.com/894026/226398121-57373c25-f70e-4457-bc63-5cf6573bbb80.jpg)

# Organization Cleanup
## This app will help you clean up your organizations in Zendesk.
Cleanup your Zendesk organizations by removing all users with a non-matching email domain, or by adding users with a matching domain.

This app is a showcase from the article [Cleaning up Zendesk Organisations with a sidebar app](https://internalnote.com/cleaning-up-organisations-with-a-sidebar-app)
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
<img width="1512" alt="avengers_2" src="https://user-images.githubusercontent.com/894026/226398156-599fb9e9-aad8-44c6-9de3-507021e14e9e.png">


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
<img width="1512" alt="dwarfs_2" src="https://user-images.githubusercontent.com/894026/226398230-4ef92ef2-3518-4107-930c-641f48a4fda2.png">



