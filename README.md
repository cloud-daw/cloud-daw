# cloud-daw

Our API Client-Server Relationship

Server: (still need to make more sophisticated, include MIDI npm package & routes, but example illustrated in server.js)

Client Base: src/services/httpservice.service.ts holds our legit conversations w/ the server, put POST/GET/PUT/DELETE calls here.
Client Content: w/in component.ts files, call http service using function names. getStatus is demoed, call is within app.component.ts. This gets data to our components for display on page

Essentially: Express server running on Port 8080, Angular client running on Port 4200.

NOTABLY: Angular receives information in the form of Observables, slighly wonky way of transmitting async stuff. Look into https://rxjs.dev/guide/overview for general info on rxjs.

IF: We want real time DAW collaboration (think, Figma for music), we may need to refactor w/ Socket.IO for realtime commmunication. Later concern.
