# simple-placeholder-replacer
[![Build Status](https://travis-ci.com/BenoitWauthier/simple-placeholder-replacer.svg?branch=master)](https://travis-ci.org/github/BenoitWauthier/simple-placeholder-replacer)

A library to replace placeholders in a json/string object. 
You have to use double curly brackets {{placeholderKey}} to identify the placeholder and proivide a map with pairs of key / value where the key is the name of the placeholder (case doesn't matter) and value is the replacement value for that placeholder.
The library can also handle date / date time placeholders that are {{now}} or {{today}} (again case doesn't matter) and that can be configured with the following options :

- a nymber of units to add / subtract to the system date / time 
    e.g. {{today+1d}}  -> will cause the library to replace this tag with the system date + one day
    Note that the unit is not mandatory, days will be the unit by default for {{today}} and hours for {{now}}
    
    Available units for {{today}} are :
    
        - d / D : days
        - m / M : months
        - y / Y : years
        - w / W : weeks
        
    Available units for {{now}} are :
    
        - h / H : hours
        - m / M : minutes
        - s / S : seconds
        
- the desired output format for the date / date time
    e.g. {{now=HH:MM:SS}} -> will output the current time
    Note that the format must be compatible with formats recognized by the moment js library
    
    Default formats are :
    
        - {{today}} -> YYYY-MM-DD
        - {{now}}   -> YYYY-MM-DDTHH:MM:SS

## Installation

To install with npm:

```
npm i simple-placeholder-replacer --save
```

## Usage

Usage with node:

```
var replacePlaceholders = require('simple-placeholder-replacer');

replacePlaceholders('I want {{myPlaceholder}} to be replaced', {myPlaceholder: 'this placeholder'});

--> 'I want this placeholder to be replaced'

replacePlaceholders({"myDate": "{{today+1m=DD MM YYYY}}"});

--> assulming today is the 11-03-2021 : {"myDate": "11 04 2021"}

```

## License

This is licensed under an MIT License. [See details](LICENSE)
