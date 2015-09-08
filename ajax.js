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
 * @copyright  2015 (c) Stanimir Dimitrov.
 * @license    http://www.opensource.org/licenses/mit-license.php  MIT License
 * @link       TBA
 */


;(function (window, document, undefined) {

    /**
     * The use of 'use strict' might crash some libs and ASP.NET
     * because they tend to use arguments.caller.callee
     */
    'use strict';

    var exports = {};

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
            responseTypes: {
                text: "text",
                arraybuffer: "arraybuffer",
                blob: "blob",
                doc: "document",
                json: "json",
                jsonp: "jsonp"
            },
            mimeTypes: {
                "*": "*/"+"*", // applying */* directly will be counted as comment
                text: "text/plain",
                html: "text/html",
                json: "application/json, text/javascript",
                xml: "application/xml, text/xml"
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: true,
            cache: null,
            ajaxMethod: "GET",
            timeout: 0, // XHR2
            responseState: 0,
            url: null,
            data: null,
            processData: true,
            dataType: null,
            username: null,
            password: null
        },

        /**
         * @param {Object} settings
         */
        init: function (url, settings) {
            if (typeof url === "object") {
                s = url;
                url = undefined;
            } else if (typeof settings === 'object') {
                s = settings;
            } else {
                s = ajaxify.settings;
            }
            console.log(ajaxify.extend(s, ajaxify.settings));
        },

        extend: function (obj, src) {
            for (var key in src) {
                console.log(key)
                // if (src.hasOwnProperty(key)) obj[key] = src[key];
            }
            return obj;
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

        },

        showAjaxErrors: function (xmlHttpObject) {
            console.log(xmlHttpObject.statusText);
            console.log(xmlHttpObject.status);
            console.log(xmlHttpObject.responseText)
        },

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

            if (s.username) {
                xhr.open(s.ajaxMethod, s.url, s.async, s.username, s.password);
            } else {
                xhr.open(s.ajaxMethod, s.url, s.async);
            }

            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.timeout = 30000;
            xhr.responseType = "json";
            xhr.onreadystatechange = function () {
                try {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            ajaxify.parseJSON(xhr);
                            ajaxify.init();
                        } else {
                            ajaxify.showAjaxErrors(xhr);
                        }
                    } else {
                        ajaxify.showAjaxErrors(xhr);
                    }
                } catch(e) {
                    console.log('Caught Exception: ' + e.description);
                }
            };
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    document.value = (e.loaded / e.total) * 100;
                    document.textContent = document.value; // Fallback for unsupported browsers.
                }
            };
            xhr.send(params);
            xhr = null;
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