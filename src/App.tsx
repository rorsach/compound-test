import * as React from "react";
import {
  CompoundAttributeEditor,
  AttributeListing
} from "./CompoundAttributeEditor";

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    const initialState = {
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

    this.state = {
      initialAttributes: JSON.parse(JSON.stringify(initialState.attributes)),
      attributes: JSON.parse(JSON.stringify(initialState.attributes)),
      key: Math.random()
    };
  }

  render() {
    return (
      <div className="App">
        <CompoundAttributeEditor
          initialAttributes={this.state.initialAttributes}
          attributes={this.state.attributes}
          key={this.state.key}
          handleUpdateCompoundAttribute={this.handleUpdateCompoundAttribute}
        />
      </div>
    );
  }

  handleUpdateCompoundAttribute = (attributes: AttributeListing[]) => {
    // console.log(
    //   "handle attribute change:",
    //   JSON.stringify(attributes, null, 2)
    // );
    this.setState({ attributes: attributes, key: Math.random() });
  };
}

interface AppProps {}

interface AppState {
  initialAttributes: AttributeListing[];
  attributes: AttributeListing[];
  key: number;
}
