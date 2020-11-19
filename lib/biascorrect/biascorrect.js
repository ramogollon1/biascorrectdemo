var fs = require('fs');
var { pronouns } = require('./rules');
var contents = fs.readFileSync('assets/biacorrects.tsv', 'utf8');
const lines = contents.split("\r\n");
const rules = pronouns();

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

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const suggestionByPronouns = (rulesArray, rule, pronoun, contraction, val) => (
   rulesArray[rule].filter( a => {
    let regex = new RegExp(`\\b(${pronoun})+\\s[\\s\\S]+\\s(${a.BAD_WORD})`)
    if(contraction != '') {
      regex = new RegExp(`(${pronoun})+(('${contraction}|’${contraction})?)+\\s+(([\\s\\S]+\\s)?)+(${a.BAD_WORD})`);
    }
    return regex.test(val)
  })
)

const suggestionByNone = (rulesArray, rule, val) => {
  return rulesArray[rule].filter( a => {
   let regex = new RegExp(`${a.BAD_WORD}`)
   return regex.test(val)
 })
}

let rulesArray = [];
const BIAS_CORRECTION = messageMaybeInUppercase => {
  let message = messageMaybeInUppercase.toLowerCase()
  message = message.replace(/^(\b((she|he|el|ella)\b)?('s|’s)?)?(\b(They|You|We)\b)?('er|’er)?(\b(Him|Her)\b)?/g, "|$1").split('|')
  message.shift()
  let suggestions = []
  console.log('message',{message});
  // priority 1
  rules.forEach((value) => {
    let {pronoun, contraction, rule} = value
    let regex = new RegExp(`\\b${pronoun}\\b('${contraction}|"${contraction})?`)
    rulesArray[rule] = message[0].includes(pronoun) ? rulesParsed.filter(a =>(regex.test(a.DIVERSITY))) : rulesParsed.filter(a =>('none' == a.DIVERSITY ||'ninguno' == a.DIVERSITY))
    message.forEach((val) => {
      if(regex.test(val)) {
        suggestions = [...suggestions, (val.includes(pronoun)) ?
          suggestionByPronouns(rulesArray, rule, pronoun, contraction, val)
         : []]
      } else {
        console.log('val', val)
        suggestions = [...suggestions, (val.includes(pronoun)) ?
          suggestionByPronouns(rulesArray, rule, pronoun, contraction, val)
         : suggestionByNone(rulesArray, rule, val)]
      }
    })
  });
  console.log('suggestions', suggestions.filter(function (el) {
    let length = el.length;
    return length != 0;
  }));
  return suggestions.filter(function (el) {
    let length = el.length;
    return length != 0;
  });
}

exports.BIAS_CORRECTION = BIAS_CORRECTION
