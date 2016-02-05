/**
 * MIT License
 * ===========
 *
 * Copyright (c) 2015 Stanimir Dimitrov <stanimirdim92@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @author     Stanimir Dimitrov <stanimirdim92@gmail.com>
 * @copyright  2016 (c) Stanimir Dimitrov.
 * @license    http://www.opensource.org/licenses/mit-license.php  MIT License
 */


;(function (window, document, undefined) {

    /**
     * The use of 'use strict' might crash some libs and ASP.NET
     * because they tend to use arguments.caller.callee
     */
    'use strict';

    var exports = {};
    // timeout handle
    var timeoutTimer;
    var s;
    var rquery = ( /\?/ );
    var ajaxify = {

        /**
         * Default settings
         */
        settings: {
            accepts: {
                "*": "*/"+"*", // applying */* directly will be counted as comment
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript",
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: true,
            method: "GET",
            timeout: 0, // XHR2
            url: location.href,
            username: null,
            password: null,
            dataType: "json",
            data: null,
            headers: {},
        },

        extend: function (obj, src) {
            for (var key in src) {
                if (obj.hasOwnProperty(key)) {
                    src[key] = obj[key];
                }
            }

            return src;
        },

        /**
         * http://caniuse.com/#feat=xhr2
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
         *
         * @return {Int} The XMLHttpRequest version
         */
        detectXMLHttpVersion: function () {
            if ('FormData' in window) {
                return 2;
            }

            return 1;
        },

        /**
         * @param {Object} data The XMLHttpRequest responseText
         */
        parseJSON: function (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return [e, data];
            }
        },

        /**
         * Taken from jQuery.js
         *
         * @param {Object} response The XMLHttpRequest response
         */
        parseXML: function(response) {
            var xml, tmp;
            if ( !response || typeof response !== "string" ) {
                return null;
            }
            try {
                if ( window.DOMParser ) { // Standard
                    tmp = new window.DOMParser();
                    xml = tmp.parseFromString( response, "text/xml" );
                } else { // IE
                    xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( response );
                }
            } catch ( e ) {
                xml = undefined;
            }
            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                jQuery.error( "Invalid XML: " + response );
            }
            return xml;
        },

        /**
         * @param {Object} request The XMLHttpRequest request
         */
        setHeaders: function (request) {
            if (s.contentType !== false) {
                request.setRequestHeader("Content-type", s.contentType);
            }
            if (s.accepts[s.dataType] !== false) {
                request.setRequestHeader("Accept", s.accepts[s.dataType]);
            }
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            // Check for headers option
            for (var i in s.headers) {
                request.setRequestHeader(i, s.headers[i]);
            }
        },

        /**
         * @param {Object} xhr The XMLHttpRequest
         */
        showAjaxErrors: function (xhr) {
            console.error("Status text: " + xhr.statusText);
            console.error("XHR error: " + xhr.error);
            console.error("Status: " + xhr.status);
            console.error("Response text: " + xhr.responseText);
        },

       /**
         * @param {Object} settings
         */
        getSettings: function(settings) {
            if (typeof settings === 'object') {
                return ajaxify.extend(settings, ajaxify.settings);
            } else {
                return ajaxify.settings;
            }
        },

        /**
         * @param {Object} data
         */
        convertObjectToText: function(data) {
            var pairs = [];

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var k = encodeURIComponent(prop),
                        v = encodeURIComponent(data[prop]);
                    pairs.push( k + "=" + v);
                }
            }

            return pairs.join("&");
        }

        /**
         * @param {Object} settings
         * @param {Callback} callback
         */
        ajax: function (settings, callback) {
            s = ajaxify.getSettings(settings);

            if (typeof s.data === 'object') {
                s.data = convertObjectToText(s.data);
            }

            /**
             * IE 5.5+ and any other browser
             */
            var request = new (window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            s.method = s.method.toUpperCase() || 'GET';

            if (s.method === 'GET') {
                s.url = (s.url += (rquery.test(s.url) ? "&" : "?") + s.data);
            }

            /**
             * Open socket
             */
            request.open(s.method, s.url, s.async, s.username, s.password);

            ajaxify.setHeaders(request);

            if (ajaxify.detectXMLHttpVersion() === 2 && s.async && s.timeout > 0) {
                request.timeout = s.timeout;
                timeoutTimer = window.setTimeout(function() {
                    request.abort("timeout");
                }, s.timeout);
            }

            request.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 300) {
                        if (typeof callback === 'function') {
                            callback(this.responseText, this.getAllResponseHeaders(), this);

                            // Clear timeout if it exists
                            if (timeoutTimer) {
                                window.clearTimeout(timeoutTimer);
                            }
                        } else {
                            throw new Error('Second parameter must be a callback');
                        }
                    } else {
                        ajaxify.showAjaxErrors(this);
                    }
                }
            };

            request.onerror = function () {
                ajaxify.showAjaxErrors(this);
            };

            // request.upload.onprogress = function(e) {
            //     if (e.lengthComputable) {
            //         document.value = (e.loaded / e.total) * 100;
            //         document.textContent = document.value; // Fallback for unsupported browsers.
            //     }
            // };

            request.send(s.data || null);

            return this;
        },

        abort: function (request) {
            if (request) {
                request.onreadystatechange = function () {}
                request.abort();
                request = null;
            }
        },
    };

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = ajaxify;
    } else {
        window.ajaxify = ajaxify;
        if (typeof define === "function" && define.amd) {
            define( "ajaxify", [], function () {
                return ajaxify;
            });
        }
    }
})(window, document);
