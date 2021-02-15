/**
 * @fileoverview js plugin es6 citicbank
 * @author 
 */
"use strict";

// Requirements
var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");
