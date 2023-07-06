# cloud-daw

## To Spin Up:

Requires 2 terminal windows.

1. In client directory, ng serve
2. In server directory, npm start

## API Client-Server Relationship:

Server: not yet doing anything

Client Base: src/services/httpservice.service.ts tempalte holds our legit conversations w/ the server, put POST/GET/PUT/DELETE calls here. -- can make more services when we have more rouotes
Client Content: w/in component.ts files, call http service

Essentially: Express server running on Port 8080, Angular client running on Port 4200.

NOTABLY: Angular receives data from http in the form of Observables. https://rxjs.dev/guide/overview for general info on rxjs.

## RECORDING & MIDI DATA

2/8: Poly synth records into array, not synced w/ DB, not converting from MIDI (listens to raw key up/down events)
Need to, UI: Visualize keyboard, recorded track
Need to, Server: Process recording array and store in model

## Final Description

Online digital music production tool. Allows users to create and manage multiple tracks/projects by using a variety of instruments (piano, drums, etc.) with an intuitive and easy to use interface. 

## Link

https://cloud-daw.vercel.app/

