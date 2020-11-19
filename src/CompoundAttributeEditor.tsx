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
      (attribute) => attribute.secondaryAttributes
    );
    const nonPrimaryAttributes: AttributeListing[] = attributes.filter(
      (attribute) => !attribute.secondaryAttributes
    );

    return (
      <Card>
        <CardHeader
          title="Compound Outputs"
          subheader="Pick a primary attribute and then secondary attributes to associate with it."
        />
        <CardContent>
          <List className="compoundAttributeEditor-mainList">
            {/* START new Primary item */}
            <Box pb={3}>
              <ListItem
                className="compoundAttributeEditor-primary-empty"
                dense={true}
              >
                <Autocomplete
                  fullWidth
                  disableClearable
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
                      helperText="Make a selection to add a new primary attribute"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  onChange={this.handleChangePrimaryEmpty}
                />
              </ListItem>
            </Box>
            {/* END new Primary item */}
            {primaryAttributes.map((primary) => {
              return (
                <Box key={primary.id} mb={1}>
                  {/* START Primary Attribute Display */}
                  <ListItem
                    className="compoundAttributeEditor-primary"
                    dense={true}
                  >
                    <Autocomplete
                      className="compoundAttributeEditor-primarySelect"
                      disableClearable
                      fullWidth
                      options={
                        this.isPrimaryNew(primary)
                          ? [primary]
                          : [primary, ...nonPrimaryAttributes]
                      }
                      disabled={
                        primary.secondaryAttributes &&
                        primary.secondaryAttributes.length !== 0
                      }
                      id={primary.id}
                      key={primary.id}
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
                      onChange={this.handleChangePrimaryProvider(primary)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        disabled={this.isPrimaryNew(primary)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {/* END Primary Attribute Display */}
                  {/* START Secondary Attributes Display */}
                  <List disablePadding>
                    {/* START new Secondary item */}
                    <ListItem
                      className="compoundAttributeEditor-secondary-empty"
                      dense={true}
                    >
                      <Autocomplete
                        fullWidth
                        disableClearable
                        options={nonPrimaryAttributes.filter(
                          (item) =>
                            !this.isSecondaryContainedInPrimary(primary, item)
                        )}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Secondary"
                            margin="normal"
                            helperText="Make a selection to add a new secondary attribute"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                        onChange={this.handleChangeSecondaryEmoptyProvider(
                          primary
                        )}
                      />
                    </ListItem>
                    {/* END new Secondary item */}
                    {primary.secondaryAttributes!.map((secondary) => {
                      return (
                        <ListItem
                          key={secondary.id}
                          className="compoundAttributeEditor-secondary"
                          dense={true}
                        >
                          <Autocomplete
                            fullWidth
                            disableClearable
                            disabled={!this.isSecondaryNew(primary, secondary)}
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
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              disabled={
                                !this.isSecondaryNew(primary, secondary)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                  {/* END Secondary Attributes Display */}
                </Box>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  isPrimaryNew(primary: AttributeListing): boolean {
    const initialPrimaryAttributes: AttributeListing[] = this.props.initialAttributes.filter(
      (attribute) => attribute.secondaryAttributes
    );
    const primaryIndex: number = initialPrimaryAttributes.findIndex(
      (item) => item.id === primary.id
    );
    return primaryIndex > -1;
  }

  isSecondaryContainedInPrimary(
    primary: AttributeListing,
    secondary: AttributeListing
  ): boolean {
    return !!primary?.secondaryAttributes?.some(
      (item) => item.id === secondary.id
    );
  }

  isSecondaryNew(
    primary: AttributeListing,
    secondary: AttributeListing
  ): boolean {
    const primaryIndex = this.props.initialAttributes.findIndex(
      (item) => item.id === primary.id
    );

    const initialPrimary = this.props.initialAttributes[primaryIndex];

    if (initialPrimary && initialPrimary.secondaryAttributes) {
      return !initialPrimary.secondaryAttributes.some(
        (item) => item.id === secondary.id
      );
    }

    return true;
  }

  handleDeleteAttributeProvider = () => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {};

  handleChangePrimaryProvider = (primary: AttributeListing) => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {
    if (!value) {
      return;
    }

    const attributes: AttributeListing[] = JSON.parse(
      JSON.stringify(this.state.attributes)
    );
    const primaryIndex = attributes.findIndex((item) => item.id === primary.id);
    const primaryToUpdate =
      primaryIndex > -1 ? attributes[primaryIndex] : undefined;

    if (primaryToUpdate) {
      value.secondaryAttributes = primaryToUpdate.secondaryAttributes;
      attributes[primaryIndex] = value;
      delete primaryToUpdate.secondaryAttributes;
      this.props.handleUpdateCompoundAttribute(attributes);
    }
  };

  handleChangePrimaryEmpty = (
    event: React.ChangeEvent<{}>,
    value: AttributeListing
  ) => {
    const attributes: AttributeListing[] = JSON.parse(
      JSON.stringify(this.state.attributes)
    );

    value.secondaryAttributes = [];
    const indexToUpdate = attributes.findIndex((item) => item.id === value.id);
    attributes[indexToUpdate] = value;

    this.props.handleUpdateCompoundAttribute(attributes);
  };

  handleChangeSecondaryProvider = (
    primary: AttributeListing,
    secondary: AttributeListing
  ) => (event: React.ChangeEvent<{}>, value: AttributeListing | null) => {
    if (!value) {
      return;
    }

    const attributes: AttributeListing[] = JSON.parse(
      JSON.stringify(this.state.attributes)
    );
    const primaryToUpdate = attributes.find((item) => item.id === primary.id);

    if (primaryToUpdate && primaryToUpdate.secondaryAttributes) {
      const secondaryIndex = primaryToUpdate.secondaryAttributes.findIndex(
        (item) => item.id === secondary.id
      );
      primaryToUpdate.secondaryAttributes[secondaryIndex] = value;
      this.props.handleUpdateCompoundAttribute(attributes);
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
      this.props.handleUpdateCompoundAttribute(attributes);
    }
  };

  isNewPrimaryAttribute(attribute: AttributeListing): boolean {
    if (this.props.initialAttributes.find((item) => item.id === attribute.id)) {
      return false;
    } else {
      return true;
    }
  }

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
  initialAttributes: AttributeListing[];
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
