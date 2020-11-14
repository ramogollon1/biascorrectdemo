var fs = require('fs');

var contents = fs.readFileSync('assets/biacorrects.tsv', 'utf8');
const lines = contents.split("\r\n");

const [title, ...rulesAsLines] = lines
const rulesParsed = rulesAsLines.map ( line => {
  const splitByTab = line.split("\t");
  const [DIVERSITY, BAD_WORD, REPLACEMENT, REASON] = splitByTab
  return {
    DIVERSITY,
    BAD_WORD,
    REPLACEMENT,
    REASON
  }
}).filter(a =>
  a.BAD_WORD !== undefined &&
  a.REPLACEMENT !== undefined
).map(({
  DIVERSITY,
  BAD_WORD,
  REPLACEMENT,
  REASON
}) => {
  return {
    "DIVERSITY": DIVERSITY.toLowerCase(),
    "BAD_WORD": BAD_WORD.toLowerCase(),
    "REPLACEMENT": REPLACEMENT.toLowerCase(),
    REASON
  }
}
)

const femaleOnlyRules = rulesParsed.filter(a => a.DIVERSITY == "she")
const maleOnlyRules = rulesParsed.filter(a => a.DIVERSITY == "he")
const generalRules = rulesParsed.filter(a => a.DIVERSITY != "he" && a.DIVERSITY != "she")

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
const BIAS_CORRECTION = messageMaybeInUppercase => {
  const message = messageMaybeInUppercase.toLowerCase()
  let suggestions = []
  // priority 1
  suggestions = [...suggestions, (message.includes("she")) ?
    femaleOnlyRules.filter( a => message.includes(a.BAD_WORD))
   : []]
  // priority 2
  suggestions = [...suggestions, (message.includes("he")) ?
    maleOnlyRules.filter( a => message.includes(a.BAD_WORD))
  :  []]
  // priority 3
  suggestions = [...suggestions, generalRules.filter( a => message.includes(a.BAD_WORD))]

  return flatten(suggestions)
}

exports.BIAS_CORRECTION = BIAS_CORRECTION
