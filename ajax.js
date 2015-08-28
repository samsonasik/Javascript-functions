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
 * @category
 * @package
 * @author     Stanimir Dimitrov <stanimirdim92@gmail.com>
 * @copyright  2015 Stanimir Dimitrov.
 * @license    http://www.opensource.org/licenses/mit-license.php  MIT License
 * @version    0.0.3
 * @link       TBA
 */

/**
 * The use of 'use strict' might crash some libs and ASP.NET
 * because they tend to use arguments.caller.callee
 */
'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.ajaxify = factory(root);
    }
}(this, function (root) {

    /**
     * s is not a global var
     */
    var s,
        ajaxify = {

        /**
         * Default settings
         */
        settings: {
            methods: {
                post: "POST",
                get: "GET",
                put: "PUT"
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            mimeTypes: {
                "*": "*/"+"*", // applying */* directly will be counted as comment
                text: "text/plain",
                html: "text/html",
                json: "application/json, text/javascript"
                xml: "application/xml, text/xml",
            },
            async: true,
            timeout: 0, // XHR2
            responseState: 0,
            url: null,
            data: null,
            dataType: null,
            username: null,
            password: null
        },

        /**
         * @param {Object} settings
         */
        init: function (settings) {
            if (typeof this.settings === 'object') {
                s = this.settings;
            } else {
                s = ajaxify.settings;
            }
            console.log(s)
        },

        /**
         * http://caniuse.com/#feat=xhr2
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHTTPRequest
         *
         * @return {Int} The XMLHttpRequest version
         */
        detectXMLHttpVersion: function () {
            if ('FormData' in window) {
                return 2;
            } else {
                return 1;
            }
        },

        /**
         * @param {Object} response The XMLHTTPRequest response
         */
        parseJSON: function (response) {
            var result;
            try {
              result = JSON.parse(response.responseText);
            } catch (e) {
              result = response.responseText;
            }
            return [result, response];
        },

        setCustomRequestHeader: function(headerName, headerValue) {
            var headers = [];
            headerName = headerName.toLowerCase();
            headers[headerName] = headerValue;
            // return this;
        },

        getCustomRequestHeader: function (headerName) {

        }

        /**
         * @param {string} url where the POST will be send
         * @callback setViewCallBack The callback that handles the response.
         * @param {string} params holds the container name and the keysession
         */
        xhr: function (url, setViewCallBack, params) {
            /**
             * IE 5.5+ and any other browser
             */
            var xhr = new(root.XMLHttpRequest || root.ActiveXObject)('MSXML2.XMLHTTP.3.0');

            xhr.open("POST", url, true);

            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.timeout = 30000;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        ajaxify.parseJSON(xhr);
                        ajaxify.init();
                    } else {
                        console.log(xhr.statusText);
                        console.log(xhr.status);
                        console.log(xhr.responseText);
                    }
                }
            }
            xhr.send(params);
            xhr = null;
        },
    };

    if (document.readyState === 'complete') {
        setTimeout(ajaxify.init);
    } else if (document.addEventListener) {
        ajaxify.settings.headers;
        document.addEventListener("DOMContentLoaded", ajaxify.init, false);
        document.addEventListener("load", ajaxify.init, false);
    } else {
        document.attachEvent('onreadystatechange', ajaxify.init);
        root.attachEvent("onload", ajaxify.init);
    }
}));