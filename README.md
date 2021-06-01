# xslt-in-browser
How to apply an xsl stylesheet to an xml document where everything is a string and you don't have to search around for scattered sources of information.

```javascript

const Math = (xml, xsl) => {
  // Convert strings into DOM Nodes
  const documentSource = parser.parseFromString(xml, 'text/xml');
  const transform = parser.parseFromString(xsl, 'text/xml');

  // Apply transform
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  const resultDocument = xsltProcessor.transformToDocument(documentSource);

  // Obtain result as a string
  var serializer = new XMLSerializer();
  var transformed = serializer.serializeToString(
    resultDocument.documentElement
  );
  return transformed;
}
```

TODO:
Add sources of information
Link to which libraries this should be used with 
Github pages
