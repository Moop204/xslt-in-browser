import {
  Card,
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./App.css";
const format = require("xml-formatter");

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

//styled component Li
// const ColGrid = styled.Grid`
//   height: "100vh";
// `;

const useStyles = makeStyles({
  column: {
    flex: 1,
  },
  inputSpacing: {
    height: "22px",
  },
});

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

  const [document, setDocument] = useState(format(defaultDocument as string));
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
      const formattedXml = format(e.target?.result as string);
      stateUpdate(formattedXml);
    };
    reader.readAsText(file);
  };

  const style = useStyles();
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item container style={{ height: "100vh" }} xs={4}>
        <Card className={style.column}>
          <Typography variant="h3">XML Document</Typography>
          <Divider />
          <input
            type="file"
            id="document-input"
            onInput={(e) => {
              handleReadingFile(e, setDocument);
            }}
          />
          <Divider />
          <div style={{ whiteSpace: "pre-wrap" }}>{document}</div>
        </Card>
      </Grid>

      <Grid item container style={{ height: "100vh" }} xs={4}>
        <Card className={style.column}>
          <Typography variant="h3">XSLT Transform</Typography>
          <Divider />
          <input
            type="file"
            id="transform-input"
            onInput={(e) => {
              handleReadingFile(e, setTransform);
            }}
          />
          <Divider />
          <div style={{ whiteSpace: "pre-wrap" }}>{transform}</div>
        </Card>
      </Grid>
      <Grid item container style={{ height: "100vh" }} xs={4}>
        <Card className={style.column}>
          <Typography variant="h3">Transformation</Typography>
          <Divider />
          <div className={style.inputSpacing} />
          <div style={{ whiteSpace: "pre-wrap" }}>{transformed}</div>
        </Card>
      </Grid>
    </Grid>
  );
}

export default App;
