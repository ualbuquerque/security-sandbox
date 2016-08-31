/**
 * Sample Javascript code for SAST evalution purposes
 */

const _ = require('lodash');
const logger = require('winston');
const request = require('request');
const xmldom = require('xmldom').DOMParser;
const xpath = require('xpath');

function display(string) {
  /* This should be flagged */
  eval(`logger.info("${string}")`);
}

logger.info('Fetching RSS from YCombinator');
request.get('https://news.ycombinator.com/rss', function(error, response, body) {
  const xmldoc = new xmldom().parseFromString(body);
  const items = xpath.select('//rss/channel/item', xmldoc);

  _(items).forEach(function(item) {
    const title = xpath.select('title/text()', item);
    const link = xpath.select('link/text()', item)
    display(`${title} -- ${link}`);
  });
});

/* Statement injection via eval() in the display() function */
display('"); logger.info(1+1+1); //');
