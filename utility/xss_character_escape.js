'use strict';
const xss = require('xss');
const xssRegexp = /(<([^>]+)>)/ig;
const vm = require('vm');
const flat = require('flat');

/**
 * returns javascript from a string
 * @param {String} input - JavaScript code as a string
 * @returns {Any} output - parsed javascript string as valid JavaScript
 */
function parseJavaScript(input) {
  const sandbox = {
    output: {},
  };
  try {
    vm.runInNewContext(`output = ${input}`, sandbox);
    return sandbox.output;
  } catch (e) {
		// console.warn('WARNING: parseJavaScript InputError', input);
    throw(e);
  }
}
exports.parseJavaScript = parseJavaScript;

/**
 * Enforces XSS character escaping rules
 * @param  {Object} doc           Data that is being escaped
 * @param  {Object} configuration xss npm module configuration object
 * @param  {Object} options       Configurable options for character escaping
 * @param {Boolean} [options.html_xss] If true xss module is used for character escaping
 * @param {Boolean} [options.skip_xss] If true character escaping is ignored
 * @return {Object}               Returns either original document or object with xss character escaping rules applied
 */
module.exports = function enforceXSSRules(doc, configuration, options = {}) {
	if (!options.skip_xss) {
		const errors = [];
		try {
			const docString = JSON.stringify(doc,null,2);
			if (configuration && options.html_xss) return parseJavaScript(xss(docString, configuration));
			else return parseJavaScript(docString.replace(xssRegexp, ''));
		} catch (errorXSS) {
			errors.push(errorXSS);
			const docString = JSON.stringify(doc, null, 2);
			try {
				return parseJavaScript(docString.replace(xssRegexp, ''));
			} catch (errorRegEx) {
				errors.push(errorRegEx);
				try {
					const flattenDoc = flat.flatten(doc);
					const safeDocFlattened = Object.keys(flattenDoc).reduce((result, prop) => {
						const val = flattenDoc[ prop ];
						result[ prop ] = typeof val === 'string'
							? xss(val, configuration)
							: val;
						return result;
					}, {});
					const safeDoc = flat.unflatten(safeDocFlattened);
					return safeDoc;
				} catch (errorFlat) {
					errors.push(errorFlat);
					throw errorFlat;
				}
			}
		}
	}
	else return doc;
};