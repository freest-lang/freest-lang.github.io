// heavily inspired by https://github.com/ajaxorg/ace-builds/blob/master/src/mode-haskell.js
// develop using the intended tool https://ace.c9.io/tool/mode_creator.html

define('ace/mode/freest_highlight_rules'
      , ["require","exports","module","ace/lib/oop", "ace/mode/text_highlight_rules"]
      , function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    
    var FreestHighlightRules = function() {
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used
       this.$rules = {
            'start' : [
                { include: '#comments' },
                { include: '#types' },
                { include: '#keywords' },
                { include: '#literals' },
                {
                    token: 'entity.name.function.freest',
                    regex: /^[a-z][a-zA-Z0-9_']*(\s*)(:)/
                }
            ],


            '#comments': [
                { include: '#line_comment' },
                { include: '#block_comment' }
            ],

            '#line_comment': [
                {
                    token: ['punctuation.definition.comment.freest'
                           , 'comment.line.double-dash.freest'
                           , 'keyword.todo.freest'
                           , 'comment.line.double-dash.freest'
                           ],
                    regex: /(--)(?:(.*(?=\bTODO\b))(\bTODO\b))?(.*)/,
                    push_: [
                        { 
                            token: 'comment.line.double-dash.freest',
                            regex: /$/,
                            next: 'pop' 
                        },
                        { defaultToken: 'comment.line.double-dash.freest' },
                        { include: '#block_comment' }
                    ]
                }
            ],

            '#block_comment': [
                {
                    token: 'punctuation.definition.comment.freest',
                    regex: /\{-/,
                    push: [
                        // {include: '#block_comment'}, // nested comments are not in freest
                        {
                            token: 'punctuation.definition.comment.freest',
                            regex: /-\}/,
                            next: 'pop'
                        },
                        { defaultToken: 'comment.block.freest' }
                    ]
                }
            ],



            '#types': [
                {
                    token: 'support.type.freest',
                    regex: /\b(Int|Char|Bool|String)\b/
                },
                {
                    token: 'support.type.session.freest',
                    regex: /\b(Skip|End)\b/
                }
            ],



            '#keywords': [
                {
                    token: 'keyword.kind.freest',
                    regex: /(1T|\*T|1S|\*S)/
                },
                {
                    token: 'keyword.typeops.freest',
                    regex: /\b(dualof)\b|(\@)/
                },
                {
                    token: 'keyword.control.freest',
                    regex: /\b(if|then|else|case|of|match|with|let|in)\b/
                },
                {
                    token: 'keyword.other.session.freest',
                    regex: /\b(new|send|receive|select|fork|close)\b/
                },
                {
                    token: 'keyword.other.type.freest',
                    regex: /\b(forall|rec|type|data)\b/
                },
                {
                    token: 'keyword.other.arrow.freest',
                    regex: /(->|\*->|1->)/
                },
                {
                    token: 'keyword.operator.freest',
                    regex: /(=|-|\+|\*|\\|>|>=|<|<=)/
                },
                { include: '#module_keywords' }
            ],

            '#module_keywords': [
                {
                    token: ['keyword.control.module.freest'
                           , 'variable.other.module.freest'
                           , 'keyword.control.module.freest'
                           ],
                    regex: /^(module)\s+(.*)\s+(where)/
                },
                {
                    token: ['keyword.control.import.freest'
                           , 'variable.other.import.freest'
                           ],
                    regex: /^(import)\s+(.*)/
                }
            ],



            '#literals': [
                { 
                    token: 'punctuation.definition.string.begin.freest',
                    regex: /"/,
                    push: [
                        { 
                            token: 'punctuation.definition.string.end.freest',
                            regex: /"/,
                            next: 'pop' 
                        },
                        { defaultToken: 'string.quoted.double.freest' }
                    ] 
                },
                { 
                    token: [ 'punctuation.definition.string.begin.freest'
                           , 'string.quoted.single.freest'
                           , 'punctuation.definition.string.end.freest'
                           ],
                    regex: /(')(.)(')/,
                },
                {
                    token: 'entity.name.tag.freest',
                    regex: /\b[A-Z][a-zA-Z0-9_.-]*\b/
                }
            ]
        };

        this.normalizeRules();
    };
    
    oop.inherits(FreestHighlightRules, TextHighlightRules);
    exports.FreestHighlightRules = FreestHighlightRules;
});


define('ace/mode/freest'
      , ["require","exports","module","ace/lib/oop", "ace/mode/freest_highlight_rules"]
      , function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    // defines the parent mode
    var TextMode = require("./text").Mode;
    var Tokenizer = require("../tokenizer").Tokenizer;
    // var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
    
    // defines the language specific highlighters and folding rules
    var FreestHighlightRules = require("./freest_highlight_rules").FreestHighlightRules;
    // var MyNewFoldMode = require("./folding/mynew").MyNewFoldMode;
    
    var Mode = function() {
        // set everything up
        this.HighlightRules = FreestHighlightRules;
        // this.$outdent = new MatchingBraceOutdent();
        // this.foldingRules = new MyNewFoldMode();
    };
    oop.inherits(Mode, TextMode);
    
    (function() {
        // configure comment start/end characters
        this.lineCommentStart = "--";
        this.blockComment = {start: "{-", end: "-}"};
        
        // special logic for indent/outdent. 
        // By default ace keeps indentation of previous line
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
            return indent;
        };
    
        // this.checkOutdent = function(state, line, input) {
        //     return this.$outdent.checkOutdent(line, input);
        // };
    
        // this.autoOutdent = function(state, doc, row) {
        //     this.$outdent.autoOutdent(doc, row);
        // };
        
        // create worker for live syntax checking
        this.createWorker = function(session) {
            var worker = new WorkerClient(["ace"], "ace/mode/mynew_worker", "NewWorker");
            worker.attachToDocument(session.getDocument());
            worker.on("errors", function(e) {
                session.setAnnotations(e.data);
            });
            return worker;
        };
        
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
    });
    