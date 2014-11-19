// Inspired by: https://github.com/adrai/enum.git
(function(name, factory) {

    if (typeof define === 'function') { // RequireJS
        define(factory);
    } else if (typeof module !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory();
    } else { // Browser
        this[name] = factory();
    }

})('enum', function(undefined) {

	var PROTECTED_KEYS = [ 'name', 'enums', 'getKey', 'getValue', 'get' ],

		toString = ({}).toString,

		isString = function(obj) {
	        return toString.call(obj) === '[object String]';
	    },

	    isArray = Array.isArray || function(obj) {
	        return toString.call(obj) === '[object Array]';
	    };

	/**
	 * Represents an Item of an Enum.
	 * @param {String} key   The Enum key.
	 * @param {Number} value The Enum value.
	 */
	var EnumItem = function(key, value) {
		this.key = key;
		this.value = value;

		if (key === undefined || key === null || value === undefined || value === null) {
			throw 'EnumItem key and/or value is invalid';
		}
	};

	EnumItem.prototype = {

		/**
		 * Checks if the EnumItem is the same as the passing object.
		 * @param  {EnumItem || String || Number} key The object to check with.
		 * @return {Boolean}                          The check result.
		 */
		is: function(key) {
			if (_isString(key)) {

				return (this.key === key);

			} else if (key instanceof EnumItem) {

				return (this.key === key.key);

			} else {

				return (this.value === key);

			}
		},

		/**
		 * Returns String representation of this EnumItem.
		 * @return {String} String representation of this EnumItem.
		 */
		toString: function() {
			return '[key: '+ this.key +', value: '+ this.value +']';
		},

		/**
		 * Returns JSON object representation of this EnumItem.
		 * @return {String} JSON object representation of this EnumItem.
		 */
		toJSON: function() {
			return this.value;
		},

		/**
		 * Returns the value to compare with.
		 * @return {String} The value to compare with.
		 */
		valueOf: function() {
			return this.value;
		}

	};


	/**
	 * Represents an Enum with enum items.
	 * @param {String}           name    The name of the enum.
	 * @param {Array || Object}  map     This are the enum items.
	 */
	var Enum = function(name, map) {

		this.name = name;
		this.enums = [];

		if (_isArray(map)) {
			var array = map;
			map = {};

			var idx = 0, length = array.length;
			for (; idx < length; idx++) {
				map[array[idx]] = Math.pow(2, idx);
			}
		}

		var member;
		for (member in map) {
			if (PROTECTED_KEYS.indexOf(member) > -1) {
				throw 'Enum key "' + member + '" is a reserved word';
			}

			this[member] = new EnumItem(member, map[member]);
			this.enums.push(this[member]);
		}
	};

	Enum.prototype = {

		/**
		 * Returns the appropriate EnumItem key.
		 * @param  {EnumItem || String || Number} key The object to get with.
		 * @return {String}                           The get result.
		 */
		getKey: function(value) {
			var item = this.get(value);
			if (item) { return item.key; }

			return null;
		},

		/**
		 * Returns the appropriate EnumItem value.
		 * @param  {EnumItem || String || Number} key The object to get with.
		 * @return {Number}                           The get result.
		 */
		getValue: function(key) {
			var item = this.get(key);
			if (item) { return item.value; }

			return null;
		},

		/**
		 * Returns the appropriate EnumItem.
		 * @param  {EnumItem || String || Number} key The object to get with.
		 * @return {EnumItem}                         The get result.
		 */
		get: function(key) {
			if (key === null || key === undefined) { return null; }

			if (_isString(key)) {

				return this[key];

			} else if (key instanceof EnumItem) {

				var idx = this.enums.length - 1;
				while (idx--) {
					if (this.enums[idx].is(key)) {
						return this.enums[idx];
					}
				}

			} else {

				var prop;
				for (prop in this) {
					if (this[prop].value === key) {
						return this[prop];
					}
				}

			}

			return null;
		}
	};

	return function(name, map) {
		return new Enum(name, map);
	};

}());