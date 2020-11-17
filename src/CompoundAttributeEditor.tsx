import {
  Card,
  CardContent,
  List,
  ListItem,
  TextField
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as React from "react";

export default class CompoundAttributeEditor extends React.Component<
  CompoundAttributeEditorProps,
  CompoundAttributeEditorState
> {
  constructor(props: CompoundAttributeEditorProps) {
    super(props);
    this.state = {
      availableAttributes: this.props.attributes.concat()
    };
  }

  // Add logic to create new empties?
  // Add logic to remove primary attributes from secondary list
  // Add logic to store new selections in the secondary attributes array

  render() {
    const { attributes } = this.props;
    return (
      <Card>
        <CardContent>
          <List className="compound-primary">
            {attributes.map((attribute) => {
              if (
                attribute.secondaryAttributes &&
                attribute.secondaryAttributes.length
              ) {
                return (
                  <React.Fragment>
                    <ListItem>
                      <Autocomplete
                        fullWidth
                        options={attributes}
                        id="debug"
                        debug
                        getOptionLabel={(option) => option.name}
                        value={attribute}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Primary"
                            margin="normal"
                          />
                        )}
                      />
                    </ListItem>
                    <div>
                      <List className="compound-secondary">
                        {attribute.secondaryAttributes.map((secondary) => {
                          return (
                            <ListItem>
                              <Autocomplete
                                fullWidth
                                options={attributes}
                                id={secondary.id}
                                debug
                                getOptionLabel={(option) => option.name}
                                value={secondary}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Secondary"
                                    margin="normal"
                                  />
                                )}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
          </List>
        </CardContent>
      </Card>
    );
  }
}

interface CompoundAttributeEditorProps {
  attributes: AttributeListing[];
}

interface CompoundAttributeEditorState {
  availableAttributes: AttributeListing[];
  primaries?: AttributeListing[];
}

interface AttributeListing {
  name: string;
  id: string;
  secondaryAttributes?: AttributeListing[];
}
