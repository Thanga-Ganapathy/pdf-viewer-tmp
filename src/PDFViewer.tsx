import { Document, Page } from "react-pdf";
import VirtualList from "./lib/VirtualList";

import { pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState } from "react";
import { Box } from "@mui/material";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

export default function PDFViewer({ width, height, scale }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Calculate itemHeight based on the scale
  const itemHeight = width * 1.5 * scale;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleRenderItem = (index: number) => {
    console.log("index", index + 0.5);

    return <Page pageNumber={index + 1} width={width} scale={scale} />;
  };

  return (
    <Box
      sx={{
        border: "1px solid grey",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Document
        // file="/apollo_17_flight_plan.pdf"
        file="/document.pdf"
        options={options}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {numPages && (
          <VirtualList
            itemCount={numPages}
            itemHeight={itemHeight}
            renderItem={handleRenderItem}
            overscan={1}
          />
        )}
      </Document>
    </Box>
  );
}
