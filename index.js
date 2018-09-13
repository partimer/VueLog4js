/*
*/

// Import the library
import Log4js from 'log4js';
import _ from 'lodash';

const deepClone = require('rfdc')({ proto: true });

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

    
// Appends category to existing configuration -- returns the logger
const logRegister = function (category,level,appenders) {
    // Only do something if a category is specified
    if (typeof category !== 'undefined' ) {
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
        
        // Note the Category was created
        internalLogger.info('Category logger registered! ', category);
    }
    return Log4js.getLogger(category);
} // end logRegister()
    
// Get the current catagories
const logCategories = function() {
    return internalOptions.categories;
} // end getCategory()
    

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
