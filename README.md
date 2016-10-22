## Hardware Lab
Website/API for managing hardware, tech and kit within the DCS store.

<p align="center"><img src ="https://raw.githubusercontent.com/Bucknalla/hardware-lab/master/assets/github/readme.gif" width="900"></p>

#### API
The API endpoints will be declared once they are complete.

 - GET /hardware : Returns a list of all hardware
 - GET /hardware?status= : Returns all hardware by status (bool for borrowed/not borrowed)
 - POST /hardware : Add one new hardware
 - GET /hardware/:id : Returns hardware by id
 - DELETE /hardware/:id : Delete hardware by id
 - PUT /hardware/status/:id : Modify hardware status (for borrowed and returned hardware)
 - GET /hardware/:name : Returns all hardware by name (e.g. "Arduino")

#### To Do
To do list for the API.

1. Add pagination to GET /hardware
2. POST /hardware?batch=true : Add multiple new hardware
3. GET /hardware/:name?count=true : Returns total number of all hardware with 'name'
4. GET /hardware/random : Returns a random piece of available hardware ('What should I build today' button)
