import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./App.css";

const defaultDocument = `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="example.xsl"?>
<Article>
  <Title>My Article</Title>
  <Authors>
    <Author>Mr. Foo</Author>
    <Author>Mr. Bar</Author>
  </Authors>
  <Body>This is my article text.</Body>
</Article>`;

const defaultTransform = `<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="text"/>

  <xsl:template match="/">
    Article - <xsl:value-of select="/Article/Title"/>
    Authors: <xsl:apply-templates select="/Article/Authors/Author"/>
  </xsl:template>

  <xsl:template match="Author">
    - <xsl:value-of select="." />
  </xsl:template>

</xsl:stylesheet>`;

function App() {
  const applyTransform = (document: string, transform: string) => {
    const parser = new DOMParser();
    const xsltProcessor = new XSLTProcessor();
    const documentSource = parser.parseFromString(
      document as string,
      "text/xml"
    );
    const transformSource = parser.parseFromString(
      transform as string,
      "text/xml"
    );
    xsltProcessor.importStylesheet(transformSource);
    const resultDocument = xsltProcessor.transformToDocument(documentSource);

    // Obtain result as a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(resultDocument.documentElement);
  };

  const [document, setDocument] = useState(defaultDocument);
  const [transform, setTransform] = useState(defaultTransform);

  const [transformed, setTransformed] = useState(
    applyTransform(document, transform)
  );

  useEffect(() => {
    setTransformed(applyTransform(document, transform));
  }, [document, transform]);

  const handleReadingFile = (
    e: any,
    stateUpdate: Dispatch<SetStateAction<string>>
  ) => {
    const file: File = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      stateUpdate(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <header className="App-header">
        XML Transformation Document
        <input
          type="file"
          id="document-input"
          onInput={(e) => {
            handleReadingFile(e, setDocument);
          }}
        />
        <br />
        {document}
        <br />
        Transform
        <input
          type="file"
          id="document-input"
          onInput={(e) => {
            handleReadingFile(e, setTransform);
          }}
        />
        <br />
        {transform}
        <br />
        Result
        <br />
        {transformed}
        <br />
      </header>
    </div>
  );
}

export default App;
