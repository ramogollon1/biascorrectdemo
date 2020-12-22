var fs = require("fs");
var { pronouns } = require("./rules");
var contents = fs.readFileSync("assets/biacorrects.tsv", "utf8");
const lines = contents.split("\r\n");
const rules = pronouns();

const [title, ...rulesAsLines] = lines;
const rulesParsed = rulesAsLines
  .map((line) => {
    const splitByTab = line.split("\t");
    const [DIVERSITY, BAD_WORD, REPLACEMENT, REASON] = splitByTab;
    return {
      DIVERSITY,
      BAD_WORD,
      REPLACEMENT,
      REASON,
    };
  })
  .filter((a) => a.BAD_WORD !== undefined && a.REPLACEMENT !== undefined)
  .map(({ DIVERSITY, BAD_WORD, REPLACEMENT, REASON }) => {
    return {
      DIVERSITY: DIVERSITY.toLowerCase(),
      BAD_WORD: BAD_WORD.toLowerCase(),
      REPLACEMENT: REPLACEMENT.toLowerCase(),
      REASON,
    };
  });

const flatten = (list) =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const suggestionByPronouns = (rulesArray, rule, pronoun, contraction, val) =>
  rulesArray[rule].filter((a) => {
    let regex = new RegExp(`\\b(${pronoun})+\\s[\\s\\S]+\\s(${a.BAD_WORD})`);
    if (contraction != "") {
      regex = new RegExp(
        `(${pronoun})+(('${contraction}|’${contraction})?)+\\s+(([\\s\\S]+\\s)?)+(${a.BAD_WORD})`
      );
    }
    return regex.test(val);
  });

const suggestionByNone = (rulesArray, rule, val) => {
  return rulesArray[rule].filter((a) => {
    let regex = new RegExp(`${a.BAD_WORD}`);
    return regex.test(val);
  });
};

let rulesArray = [];
const BIAS_CORRECTION = (messageMaybeInUppercase) => {
  if (!messageMaybeInUppercase) return;
  const message = messageMaybeInUppercase.toLowerCase();
  let suggestions = [];
  // priority 1
  rules.forEach((value) => {
    let { pronoun, rule } = value;
    let regex = new RegExp(`\\b${pronoun}\\b`);

    rulesArray[rule] = rulesParsed.filter((a) => regex.test(a.DIVERSITY));
    if (regex.test(message)) {
      suggestions = [
        ...suggestions,
        message.includes(pronoun)
          ? rulesArray[rule].filter((a) => message.includes(a.BAD_WORD))
          : [],
      ];
    }
  });
  return flatten(suggestions);
};

exports.BIAS_CORRECTION = BIAS_CORRECTION;
