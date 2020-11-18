import * as React from "react";
import CompoundAttributeEditor from "./CompoundAttributeEditor";

import "./styles.css";

export default function App() {
  let attributes = [
    {
      id: "1234",
      name: "attribute one"
    },
    {
      id: "2345",
      name: "attribute two"
    },
    {
      id: "3456",
      name: "attribute three"
    },
    {
      id: "4567",
      name: "attribute four",
      secondaryAttributes: [
        { id: "5678", name: "secondary abc" },
        { id: "6789", name: "secondary def" }
      ]
    },
    {
      id: "7890",
      name: "attribute five",
      secondaryAttributes: [
        { id: "5678", name: "secondary abc" },
        { id: "0123", name: "secondary xyz" }
      ]
    }
  ];
  return (
    <div className="App">
      <CompoundAttributeEditor attributes={attributes} />
    </div>
  );
}
