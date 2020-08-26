# <div align="center">MOCK DATA A2HL BANKING</div>    

## Installation
Clone this repo
### Generate seed
First, run server
```code
$ cd api && npm run dev
```
Next, 
```code
$ cd .. && cd generate-seed
```
Rename the __sample.env__ config file to __.env__ and config with your environments.

``` code
$ npm i
```
Finally, Seeding data to db
``` code 
$ npm run seed:customer
$ npm run seed:approve
$ npm run seed:account
$ npm run seed:transaction
```