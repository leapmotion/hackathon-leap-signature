ship_it
==============

AngularJS-based shipments page

## Quick start

To run the app (run from main directory):

* > node server.js

To deploy:

* > jitsu deploy

## Helpful hints

This app was built using AngularJS (on top of Node.js) and Bootstrap 3.0

## Code Structure

- Front-end AngularJS controllers found under /public/js/angular/controllers/*
- Back-end NodeJS (EasyPost) endpoints found under /node/endpoints/easypost_wrapper.js
- Partial templates used to render views: /public/ship

## Extras
- Uses animate.css to create smooth page transitions

## Known Issues
- 3-Step Pages, First Google Maps page currently just for show, will auto-lookup addresses, but doesn't use those in shipment
- Shipment purchasing is broken. The EasyPost API is returning failure.

## Authors

**Sean Janis**

+ [http://seanjanis.com](http://seanjanis.com)


## Copyright and license

Free!
