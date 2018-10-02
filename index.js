/*
*/

// Import the library
import Log4js from 'log4js';
import _ from 'lodash';

// Internal reference for self logging
var internalLogger;

// Internal Options so they can be updated
var internalOptions =   {
    appenders: {
        console:    {type: 'console'}
    },
    categories: {
        default: { appenders: ['console'], level: 'all' }
    },
    disableClustering: true
};

// logger objects
export const loggerRegistry = {};
    
// Appends category to existing configuration -- returns the logger
export const logRegister = function (category,level,appenders) {
    // Assume default category
    if (typeof category === 'undefined' ) {
        category = 'default';
    }
    
    // Append category -- Deep copy default options
    internalOptions.categories[category] = _.cloneDeep(internalOptions.categories.default);

    // Allow level to be overriden
    if (typeof level !== 'undefined' ) {
        internalOptions.categories[category].level=level;
    }

    // Allow the appenders to be overriden
    // Appender must already exist in global config
    if (typeof appenders !== 'undefined' ) {
        internalOptions.categories[category].appenders=appenders;
    }        

    // ReConfigure Log4js
    Log4js.configure(internalOptions);

    // new loggers incase of updates
    loggerRegistry[category] = Log4js.getLogger(category);
    // Note the Category was created
    loggerRegistry[category].info('Category logger registered! ', category);
     
    return loggerRegistry[category];
} // end logRegister()
    
// Get the current catagories
export const logCategories = function() {
    let retVal = {};
    Object.keys(internalOptions['categories']).forEach( function (curKey) {
        retVal[curKey] = loggerRegistry[curKey].level();
    });
} // end getCategory()

export const logLevel = function(level, category) {
    if( typeof category !== 'undefined' ) {
        internalOptions['categories'][category]['level'] = level;
        loggerRegistry[category].level(level);
    } else {
        
        Object.keys(internalOptions['categories']).forEach( function (curKey) {
            internalOptions['categories'][curKey]['level'] = level;
            loggerRegistry[curKey].level(level);
        });
    }
}

// Plugin object
const VueLog4js = {

    // Required methow initially called when instatiated
    install(Vue, options) {
        console.log('install called for VueLog4js!');
        // if options have been specified pass them through to Log4js-node
        if (typeof options !== 'undefined' ) {
            // A hack to force disable clustering -- which errors in browsers
            options.disableClustering = true;
            
            // Use provided options -- this needs to be a deep copy
            internalOptions = _.cloneDeep(options);
        }

        // Configure Log4js
        Log4js.configure(internalOptions);
        
        // Get the logger
        Vue.$log  = internalLogger = Log4js.getLogger();
        
        // Attach logger to Vue instance
        Vue.prototype.$log = Vue.$log;

        // Indicate in the logs which logs are enabled
        [ 'Trace', 'Debug', 'Info', 'Warn', 'Error', 'Fatal', 'Mark' ].forEach((level) => {
            Vue.$log[level.toLowerCase()]("VueLog4js:: install() "+level.toUpperCase()+" messages enabled");
        });
        
        // Attach functions
        Vue.prototype.$logRegister   = logRegister;
        Vue.prototype.$logCategories = logCategories;
        Vue.prototype.$logLevel = logLevel;
        
        // Never do heavy lifting in a mounted()
        Vue.mixin({
            mounted() {
                //Vue.$log.trace('Logging mounted for VueLog4js!');
            }
        });
    } // end install()

};

export default VueLog4js;

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueLog4js)
}
