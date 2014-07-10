callbackWrapper
===============

`wrap ( config, callback )`: Function

Wrap a callback function to add timing and logging asyncronous calls

Parameters:

* `config`: Object
   * Configuration for the logging and callback
      * `context`: Object
         * Context to run the callback function in
         * default: null
      * `logger`: Object
         * Logging utility with a warn method
         * default: console
      * `max_time_warning`: Number
      	 * Time in ms to determine if a call is too slow. Will not log if call is faster. Will always log if 0. (default: 0)
      	 * `tag`: Array | String
      	 	* Value to show in [] before log message.
      	 	* default ''
      	 * `methodName`: String
      	 	* Name of the method to display in the log
      	 	* default: ''
   * `callback`: Function
      * Function to wrap

Returns: Function

* Wrapped Callback