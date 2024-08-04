import { Box, Button } from "@mui/material";
import PDFViewer from "./PDFViewer";
import { useRef, useState } from "react";
import useResizeObserver from "./useResizeObserver";

import "./App.css";

function App() {
  const containerRef = useRef(null);
  const { width, height } = useResizeObserver(containerRef);

  const [scale, setScale] = useState(1);

  return (
    <div>
      <h3>React Virtual List</h3>
      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ mr: 2 }}
          onClick={() => setScale((prevScale) => prevScale * 1.1)}
        >
          Zoom In
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => setScale((prevScale) => prevScale / 1.1)}
        >
          Zoom out
        </Button>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 50% 1fr" }}>
        <Box />
        <Box sx={{ height: "80vh", overflow: "hidden" }} ref={containerRef}>
          <PDFViewer width={width} height={height} scale={scale} />
        </Box>
        <Box />
      </Box>
    </div>
  );
}

export default App;
