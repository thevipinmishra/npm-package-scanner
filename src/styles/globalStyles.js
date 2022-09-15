import { globalCss } from "../../stitches.config";

const globalStyles = globalCss({
  "*": { margin: 0, padding: 0 },
  body: {
    minBlockSize: "100vh",
    display: "flex",
    flexDirection: "column",
    fontSize: "1rem",
    lineHeight: "1.55",
    backgroundColor: "$bodyBackground",
    color: "$color",
    fontFamily: "$body",
    overflowX: "hidden",
  },
});

export default globalStyles;
