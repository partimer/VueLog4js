# vue-log4js
VueJS plugin wrapper for Log4js-Node javascript logging



```js
logLevels :  ['mark', 'trace', 'debug', 'info', 'warn', 'error', 'fatal']
```


## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). 

https://www.npmjs.com/package/VueLog4js

```sh
$ npm install https://github.com/partimer/vue-log4js.git --save
```

## Usage

Below you can find an example of how to use VueLog4js :

#### Properties

Configuration options are passed through to log4js. 

#### Code example

```js
import VueLog4js from 'vue-log4js';
const isProduction = process.env.NODE_ENV === 'production';
 
var options =   {
        appenders: {
        console:    {type: 'console'},
    },
    categories: {
        default: { appenders: ['console'], level: 'all' }
    },
    disableClustering: true
};


Vue.use(VueLog4js, Options);
```

```js
new Vue({
    data() {
        return {
            a : 'a',
            b : 'b'
        }
    },
    created() {
        this.$log.mark('test', this.a, 123)
        this.$log.trace('test', this.b, 456)
        this.$log.debug('test', this.a)
        this.$log.info('test', this.b)
        this.$log.warn('test')
        this.$log.error('test')
        this.$log.fatal('test')
        externalFunction()
    }
});

function externalFunction() {
   // log from external function
   Vue.$log.debug('log from function outside component.');
}
```

#### Dynamically Register new Category

```js
var myLogger = Vue.$logRegister('cheese');
new Vue({
    data() {
        return {
            a : 'a',
            b : 'b'
        }
    },
    created() {
        this.$log.mark('test', this.a, 123)
        this.$log.trace('test', this.b, 456)
        this.$log.debug('test', this.a)
        this.$log.info('test', this.b)
        this.$log.warn('test')
        this.$log.error('test')
        this.$log.fatal('test')
    }
});
