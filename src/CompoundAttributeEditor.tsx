import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  TextField
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import * as React from "react";

import "./CompoundAttributeEditor.css";

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

  // handleSelectPrimary
  // filterPrimaryfromAttributes(): AttributeListing
  // handleSelectSecondary
  // DeleteHandler

  render() {
    const { attributes } = this.props;
    const primaryAttributes: AttributeListing[] = attributes.filter(
      (attribute) =>
        attribute.secondaryAttributes && attribute.secondaryAttributes.length
    );
    const nonPrimaryAttributes: AttributeListing[] = attributes.filter(
      (attribute) => !attribute.secondaryAttributes
    );
    console.log(primaryAttributes);
    return (
      <Card>
        <CardHeader
          title="Compound Outputs"
          subheader="Pick a primary attribute and then secondary attributes to associate with it."
        />
        <CardContent>
          <List>
            {primaryAttributes.map((attribute) => {
              return (
                <React.Fragment>
                  <ListItem className="compoundAttributeEditor-primary">
                    <Autocomplete
                      fullWidth
                      options={primaryAttributes.filter(
                        (item) => item.id !== attribute.id
                      )}
                      id={attribute.id}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, attribute) =>
                        option.id === attribute.id
                      }
                      value={attribute}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Primary"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      onChange={this.handleChangePrimaryProvider()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {/* START Secondary Attributes Display */}
                  <Box pb={1}>
                    <List disablePadding>
                      {attribute.secondaryAttributes!.map((secondary) => {
                        return (
                          <ListItem className="compoundAttributeEditor-secondary">
                            <Autocomplete
                              fullWidth
                              options={primaryAttributes}
                              id={secondary.id}
                              getOptionLabel={(option) => option.name}
                              getOptionSelected={(option, secondary) =>
                                option.id === secondary.id
                              }
                              value={secondary}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Secondary"
                                  margin="normal"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                      <ListItem className="compoundAttributeEditor-secondary-empty">
                        <Autocomplete
                          fullWidth
                          options={nonPrimaryAttributes}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Secondary"
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </ListItem>
                    </List>
                  </Box>
                  {/* END Secondary Attributes Display */}
                </React.Fragment>
              );
            })}
            {/* START new Primary item */}
            <ListItem className="compoundAttributeEditor-primary-empty">
              <Autocomplete
                fullWidth
                options={nonPrimaryAttributes}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, attribute) =>
                  option.id === attribute.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Primary"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                onChange={this.handleChangePrimaryProvider()}
              />
            </ListItem>
            {/* END new Primary item */}
          </List>
        </CardContent>
      </Card>
    );
  }

  handleChangePrimaryProvider = () => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {
    // create a new empty auto complete
    // add a secondary array to this attribute
    console.log("changed:", value);
  };

  handleSelectSecondary() {}

  excludeArrayBfromArrayA(
    a: AttributeListing[],
    b: AttributeListing[]
  ): AttributeListing[] {
    return a.filter((itemA) => {
      return !b.some((itemB) => itemA.id === itemB.id);
    });
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
