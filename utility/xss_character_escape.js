'use strict';
const xss = require('xss');
const xssRegexp = /(<([^>]+)>)/ig;
const vm = require('vm');

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
		console.warn('WARNING: parseJavaScript InputError', input);
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
		try {
			if (configuration && options.html_xss) return parseJavaScript(xss(JSON.stringify(doc), configuration));
			else return parseJavaScript(JSON.stringify(doc).replace(xssRegexp, ''));
		} catch (e) {
			console.warn('WARNING:',e);
			return parseJavaScript(JSON.stringify(doc).replace(xssRegexp, ''));
		}
	}
	else return doc;
};