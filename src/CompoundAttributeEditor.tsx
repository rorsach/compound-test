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

export class CompoundAttributeEditor extends React.Component<
  CompoundAttributeEditorProps,
  CompoundAttributeEditorState
> {
  constructor(props: CompoundAttributeEditorProps) {
    super(props);
    this.state = {
      attributes: JSON.parse(JSON.stringify(this.props.attributes))
    };
  }

  // handleSelectPrimary
  // filterPrimaryfromAttributes(): AttributeListing
  // handleSelectSecondary
  // DeleteHandler

  render() {
    const { attributes } = this.state;

    const primaryAttributes: AttributeListing[] = attributes.filter(
      (attribute) =>
        attribute.secondaryAttributes && attribute.secondaryAttributes.length
    );
    const nonPrimaryAttributes: AttributeListing[] = attributes.filter(
      (attribute) => !attribute.secondaryAttributes
    );

    console.log(nonPrimaryAttributes);
    const seecondaryAttributes: AttributeListing[] = primaryAttributes.reduce(
      (acc: AttributeListing[], item) => {
        if (item.secondaryAttributes && item.secondaryAttributes.length) {
          return acc.concat(item.secondaryAttributes);
        }
        return acc;
      },
      []
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
            {primaryAttributes.map((primary) => {
              return (
                <React.Fragment>
                  <ListItem className="compoundAttributeEditor-primary">
                    <Autocomplete
                      fullWidth
                      options={primaryAttributes.filter(
                        (item) => item.id !== primary.id
                      )}
                      id={primary.id}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, attribute) =>
                        option.id === attribute.id
                      }
                      value={primary}
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
                      {primary.secondaryAttributes!.map((secondary) => {
                        return (
                          <ListItem className="compoundAttributeEditor-secondary">
                            <Autocomplete
                              fullWidth
                              options={nonPrimaryAttributes}
                              id={secondary.id}
                              getOptionLabel={(option) => option.name}
                              getOptionSelected={(option, secondary) => {
                                return option.id === secondary.id;
                              }}
                              value={secondary}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Secondary"
                                  margin="normal"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                              onChange={this.handleChangeSecondaryProvider(
                                primary,
                                secondary
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
                      {/* START new Secondary item */}
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
                          onChange={this.handleChangeSecondaryEmoptyProvider(
                            primary
                          )}
                        />
                      </ListItem>
                      {/* END new Secondary item */}
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

  handleDeleteAttributeProvider = () => () => {};

  handleChangePrimaryProvider = () => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {
    // create a new empty auto complete
    // add a secondary array to this attribute
    console.log("Primary Changed:", event, value);
  };

  handleChangeSecondaryProvider = (
    primary: AttributeListing,
    secondary: AttributeListing
  ) => (event: React.ChangeEvent<{}>, value: AttributeListing | null) => {
    if (!value) {
      return;
    }
    console.log("Secondary Changed", primary, secondary, value);
    const attributes: AttributeListing[] = JSON.parse(
      JSON.stringify(this.state.attributes)
    );
    const primaryToUpdate = attributes.find((item) => item.id === primary.id);

    if (primaryToUpdate && primaryToUpdate.secondaryAttributes) {
      const secondaryIndex = primaryToUpdate.secondaryAttributes.findIndex(
        (item) => item.id === secondary.id
      );
      primaryToUpdate.secondaryAttributes[secondaryIndex] = value;
    }
  };

  handleChangeSecondaryEmoptyProvider = (primary: AttributeListing) => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {
    if (!value) {
      return;
    }
    const attributes: AttributeListing[] = JSON.parse(
      JSON.stringify(this.state.attributes)
    );
    const primaryToUpdate = attributes.find((item) => item.id === primary.id);
    if (primaryToUpdate) {
      if (primaryToUpdate.secondaryAttributes) {
        primaryToUpdate.secondaryAttributes.push(value);
      } else {
        primaryToUpdate.secondaryAttributes = [value];
      }
    }
    console.log(attributes);
  };

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
  handleUpdateCompoundAttribute: (attributes: AttributeListing[]) => void;
}

interface CompoundAttributeEditorState {
  attributes: AttributeListing[];
}

export interface AttributeListing {
  name: string;
  id: string;
  secondaryAttributes?: AttributeListing[];
}
