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
new Vue({
    data() {
        return {
            a : 'a',
            b : 'b'
        }
    },
    created() {
        var myVueLogger = this.$logRegister('myNewLogger')
        myVueLogger.mark('test', this.a, 123)
        myVueLogger.trace('test', this.b, 456)
        myVueLogger.debug('test', this.a)
        myVueLogger.info('test', this.b)
        myVueLogger.warn('test')
        myVueLogger.error('test')
        myVueLogger.fatal('test')
    }
});

```
#### Dynamic category with plain Javascript

```js
import VueLog4js, {logStorage, logVuex, logRegister, logConfig} from 'vue-log4js';

// Immediately config VueLog4js so it is configured and available during JS import
logConfig({
    appenders: {
        console:    {type: 'console'}
    },
    categories: {
        default: { appenders: ['console'], level: 'all' }
    },
    disableClustering: true
})

// Automatically creates the category 'myDynamicJSCategory' with values of the 'default' category
const logger = logRegister('myDynamicJSCategory')

logger.debug('logging from javascript')


```

#### Sync config and loggers with a Vuex instance
```js
import VueLog4js, {logStorage, logVuex, logRegister, logConfig} from 'vue-log4js';
Vue.use(VueLog4js)

// import Vuex Store
import Vuex from 'vuex';

const logging = {
    namespaced: true,
    state: {
        config: {},
        loggerRegistry: {}
    },
    getters: {
        config: (state) => state.config,
        loggerRegistry: (state) => state.loggerRegistry,
    },
    mutations: {
        update_config (state, config) {
            state.config = config
        },
        update_loggerRegistry (state, payload) {
        },
    }
}

const store = new Vuex.Store({
    modules: {
        log: logging
    }
})

// Tell VueLog4j to update the Vuex
logVuex(    {
        default: {
            store: store,
            configMutate: 'log/update_config',
            loggerMutate: 'log/update_loggerRegistry'
        }
})
```
