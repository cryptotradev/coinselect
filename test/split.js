var coinSplit = require('../split')
var fixtures = require('./fixtures/split')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {

    var convertForEquality = function(selection) {
      var selectionCopy = Object.assign(selection, {});
      if(selectionCopy) {
        selectionCopy.fee = selectionCopy.fee ? selectionCopy.fee.toString() : selectionCopy.fee
        selectionCopy.inputs = selectionCopy.inputs ? selectionCopy.inputs.map(thing => (thing.value || thing).toString()) : selectionCopy.inputs
        selectionCopy.outputs = selectionCopy.outputs ? selectionCopy.outputs.map(thing => (thing.value || thing).toString()) : selectionCopy.outputs
      }
      return selectionCopy
    } 

    var finputs = utils.expand(f.inputs)
    var foutputs = f.outputs.concat()
    var actual = coinSplit(finputs, foutputs, f.feeRate)
    
    t.looseEqual(convertForEquality(actual), convertForEquality(f.expected))
    if (actual.inputs) {
      var actual_check = coinSplit(finputs, foutputs, f.feeRate)
      var feedback = coinSplit(finputs, actual_check.outputs, f.feeRate);
      t.looseEqual(convertForEquality(feedback), convertForEquality(f.expected))
    }

    t.end()
  })
})
