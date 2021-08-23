const applyTransform = (document: string, transform: string) => {
  const parser = new DOMParser();
  const xsltProcessor = new XSLTProcessor();
  const documentSource = parser.parseFromString(document as string, "text/xml");
  const transformSource = parser.parseFromString(
    transform as string,
    "text/xml"
  );

  try {
    xsltProcessor.importStylesheet(transformSource);
    const resultDocument = xsltProcessor.transformToDocument(documentSource);

    // Obtain result as a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(resultDocument.documentElement);
  } catch {
    return "Invalid XSLT provided.";
  }
};

export { applyTransform };
