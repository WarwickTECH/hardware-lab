## Hardware Lab
Website/API for managing hardware, tech and kit within the DCS store.

#### API
The API endpoints will be declared once they are complete.

 - GET /hardware : Returns all hardware
 - GET /hardware?status= : Returns all hardware by status (bool for borrowed/not borrowed)
 - POST /hardware : Add one new hardware
 - POST /hardware?batch=true : Add multiple new hardware
 - PUT /hardware/:id : Modify hardware by id
 - GET /hardware/:id?status= : Query hardware status (returns true if currently being borrowed)
 - DELETE /hardware/:id : Delete hardware by id
 - GET /hardware/:name : Returns all hardware by name (e.g. "Arduino")
