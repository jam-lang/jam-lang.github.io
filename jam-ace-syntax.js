// Jam syntax rules, based on Ocaml rules.
// Modified by Nick Vrvilo.
// Original license info below.

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/mode/jam_highlight_rules', [], function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var JamHighlightRules = function() {

    var keywords = (
        "let|letrec|in|map|to|if|then|else|ref"
    );

    var builtinConstants = ("true|false|empty");

    var builtinFunctions = (
        "number?|function?|list?|empty?|cons?|cons|first|rest|arity"
    );

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "constant.language": builtinConstants,
        "support.function": builtinFunctions
    }, "identifier");

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "(?:#|//).*$"
            },
            {
                token : "constant.numeric", // integer
                regex : "(?:(?:[1-9]\\d*)|(?:0))\\b"
            },
            {
                token : keywordMapper,
                "regex" : "[a-zA-Z_?][a-zA-Z0-9_?]*"
            },
            {
                token : "keyword.operator",
                regex : "[-+*/<>!=~&|;,:]"
            },
            {
                token : "paren.lparen",
                regex : "[({]"
            },
            {
                token : "paren.rparen",
                regex : "[)}]"
            },
            {
                token : "text",
                regex : "[\\s]+"
            }
        ]
    };
};

oop.inherits(JamHighlightRules, TextHighlightRules);

exports.JamHighlightRules = JamHighlightRules;
});

define('ace/mode/jam', [], function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var JamHighlightRules = require("ace/mode/jam_highlight_rules").JamHighlightRules;

var Mode = function() {
    this.HighlightRules = JamHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
}).call(Mode.prototype);

exports.Mode = Mode;
});

