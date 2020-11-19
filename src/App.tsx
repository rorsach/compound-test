import * as React from "react";
import {
  CompoundAttributeEditor,
  AttributeListing
} from "./CompoundAttributeEditor";

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      attributes: [
        { id: "0123", name: "secondary xyz" },
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
        { id: "5678", name: "secondary abc" },
        { id: "6789", name: "secondary def" },
        {
          id: "7890",
          name: "attribute five",
          secondaryAttributes: [
            { id: "5678", name: "secondary abc" },
            { id: "0123", name: "secondary xyz" }
          ]
        }
      ]
    };
  }

  render() {
    return (
      <div className="App">
        <CompoundAttributeEditor
          attributes={this.state.attributes}
          handleUpdateCompoundAttribute={this.handleUpdateCompoundAttribute}
        />
      </div>
    );
  }

  handleUpdateCompoundAttribute = (attributes: AttributeListing[]) => {
    console.log("handle attribute change:", attributes);
    this.setState({ attributes: attributes });
  };
}

interface AppProps {}

interface AppState {
  attributes: AttributeListing[];
}
