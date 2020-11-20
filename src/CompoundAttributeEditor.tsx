import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  TextField,
  Tooltip
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import * as React from "react";

import "./CompoundAttributeEditor.css";

export class CompoundAttributeEditor extends React.Component<CompoundAttributeEditorProps, CompoundAttributeEditorState> {
  constructor(props: CompoundAttributeEditorProps) {
    super(props);
    this.state = {
      attributes: JSON.parse(JSON.stringify(this.props.attributes))
    };
  }

  render() {
    const attributes = JSON.parse(JSON.stringify(this.state.attributes));
    attributes.sort((a: AttributeListing, b: AttributeListing): number => {
      console.log("sort: newa, newb:", this.isNewPrimary(a), this.isNewPrimary(b));
      if (!this.isNewPrimary(a) && this.isNewPrimary(b)) {
        return -1;
      } else if (this.isNewPrimary(a) && !this.isNewPrimary(b)) {
        return 1;
      } else {
        return 0;
      }
    });

    const primaryAttributes: AttributeListing[] = attributes.filter(
      (attribute: AttributeListing) => attribute.secondaryAttributes
    );

    console.log("primary:", attributes);
    const nonPrimaryAttributes: AttributeListing[] = attributes.filter(
      (attribute: AttributeListing) => !attribute.secondaryAttributes
    );

    console.log("primary:", attributes);

    return (
      <Card>
        <CardHeader
          title="Compound Outputs"
          subheader="Pick a primary attribute and then secondary attributes to associate with it."
        />
        <CardContent>
          <List className="compoundAttributeEditor-mainList">
            {primaryAttributes.map((primary) => {
              const isNewPrimary = this.isNewPrimary(primary);
              return (
                <Box key={primary.id} mb={1}>
                  {/* START Primary Attribute Display */}
                  <ListItem className="compoundAttributeEditor-primary" dense={true}>
                    <Autocomplete
                      className="compoundAttributeEditor-primarySelect"
                      disableClearable
                      fullWidth
                      options={this.isNewPrimary(primary) ? [primary] : [primary, ...nonPrimaryAttributes]}
                      disabled={primary.secondaryAttributes && primary.secondaryAttributes.length !== 0}
                      id={primary.id}
                      key={primary.id}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, attribute) => option.id === attribute.id}
                      value={primary}
                      renderInput={(params) => (
                        <TextField {...params} label="Primary" margin="normal" InputLabelProps={{ shrink: true }} />
                      )}
                      onChange={this.handleChangePrimaryProvider(primary)}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title={`${!isNewPrimary ? "Cannot delete existing associations" : ""}`}>
                        <span>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            disabled={!isNewPrimary}
                            onClick={this.handleDeleteAttributeProvider(primary)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {/* END Primary Attribute Display */}
                  {/* START Secondary Attributes Display */}
                  <List disablePadding>
                    {primary.secondaryAttributes!.map((secondary) => {
                      const isNewSecondary = this.isNewSecondary(primary, secondary);
                      return (
                        <ListItem key={secondary.id} className="compoundAttributeEditor-secondary" dense={true}>
                          <Autocomplete
                            fullWidth
                            disableClearable
                            disabled={!this.isNewSecondary(primary, secondary)}
                            options={nonPrimaryAttributes}
                            id={secondary.id}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, secondary) => {
                              return option.id === secondary.id;
                            }}
                            value={secondary}
                            renderInput={(params) => (
                              <TextField {...params} label="Secondary" margin="normal" InputLabelProps={{ shrink: true }} />
                            )}
                            onChange={this.handleChangeSecondaryProvider(primary, secondary)}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title={`${!isNewSecondary ? "Cannot delete existing associations" : ""}`}>
                              <span>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  disabled={!isNewSecondary}
                                  onClick={this.handleDeleteAttributeProvider(primary, secondary)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                    {/* START new Secondary item */}
                    <ListItem className="compoundAttributeEditor-secondary-empty" dense={true}>
                      <Autocomplete
                        fullWidth
                        disableClearable
                        options={nonPrimaryAttributes.filter((item) => !this.isSecondaryContainedInPrimary(primary, item))}
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
                        onChange={this.handleChangeSecondaryEmoptyProvider(primary)}
                      />
                    </ListItem>
                    {/* END new Secondary item */}
                  </List>
                  {/* END Secondary Attributes Display */}
                </Box>
              );
            })}
            {/* START new Primary item */}
            <Box pb={3}>
              <ListItem className="compoundAttributeEditor-primary-empty" dense={true}>
                <Autocomplete
                  fullWidth
                  disableClearable
                  options={nonPrimaryAttributes}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, attribute) => option.id === attribute.id}
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
          </List>
        </CardContent>
      </Card>
    );
  }

  isNewPrimary(primary: AttributeListing): boolean {
    const initialPrimaryAttributes: AttributeListing[] = this.props.initialAttributes.filter(
      (attribute) => attribute.secondaryAttributes
    );
    const primaryIndex: number = initialPrimaryAttributes.findIndex((item) => item.id === primary.id);
    return primaryIndex === -1;
  }

  isNewSecondary(primary: AttributeListing, secondary: AttributeListing): boolean {
    const primaryIndex = this.props.initialAttributes.findIndex((item) => item.id === primary.id);

    const initialPrimary = this.props.initialAttributes[primaryIndex];

    if (initialPrimary && initialPrimary.secondaryAttributes) {
      return !initialPrimary.secondaryAttributes.some((item) => item.id === secondary.id);
    }

    return true;
  }

  isSecondaryContainedInPrimary(primary: AttributeListing, secondary: AttributeListing): boolean {
    return !!primary?.secondaryAttributes?.some((item) => item.id === secondary.id);
  }

  handleDeleteAttributeProvider = (primary: AttributeListing, secondary?: AttributeListing) => () => {
    const attributes: AttributeListing[] = JSON.parse(JSON.stringify(this.state.attributes));
    const primaryIndex = attributes.findIndex((item) => item.id === primary.id);
    const primaryToUpdate = primaryIndex > -1 ? attributes[primaryIndex] : undefined;

    if (!secondary) {
      delete primaryToUpdate?.secondaryAttributes;
      this.props.handleUpdateCompoundAttribute(attributes);
    } else {
      if (primaryToUpdate && primaryToUpdate.secondaryAttributes) {
        const secondaryIndex = primaryToUpdate.secondaryAttributes.findIndex((item) => item.id === secondary.id);
        console.log("primaryToUpdate:", primaryToUpdate);
        primaryToUpdate.secondaryAttributes.splice(secondaryIndex, 1);
        console.log("primaryToUpdate:", primaryToUpdate);
        this.props.handleUpdateCompoundAttribute(attributes);
      }
    }
  };

  handleChangePrimaryProvider = (primary: AttributeListing) => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {
    if (!value) {
      return;
    }

    const attributes: AttributeListing[] = JSON.parse(JSON.stringify(this.state.attributes));
    const primaryIndex = attributes.findIndex((item) => item.id === primary.id);
    const primaryToUpdate = primaryIndex > -1 ? attributes[primaryIndex] : undefined;

    if (primaryToUpdate) {
      value.secondaryAttributes = primaryToUpdate.secondaryAttributes;
      attributes[primaryIndex] = value;
      delete primaryToUpdate.secondaryAttributes;
      this.props.handleUpdateCompoundAttribute(attributes);
    }
  };

  handleChangePrimaryEmpty = (event: React.ChangeEvent<{}>, value: AttributeListing) => {
    const attributes: AttributeListing[] = JSON.parse(JSON.stringify(this.state.attributes));

    value.secondaryAttributes = [];
    const indexToUpdate = attributes.findIndex((item) => item.id === value.id);
    attributes[indexToUpdate] = value;

    this.props.handleUpdateCompoundAttribute(attributes);
  };

  handleChangeSecondaryProvider = (primary: AttributeListing, secondary: AttributeListing) => (
    event: React.ChangeEvent<{}>,
    value: AttributeListing | null
  ) => {
    if (!value) {
      return;
    }

    const attributes: AttributeListing[] = JSON.parse(JSON.stringify(this.state.attributes));
    const primaryToUpdate = attributes.find((item) => item.id === primary.id);

    if (primaryToUpdate && primaryToUpdate.secondaryAttributes) {
      const secondaryIndex = primaryToUpdate.secondaryAttributes.findIndex((item) => item.id === secondary.id);
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
    const attributes: AttributeListing[] = JSON.parse(JSON.stringify(this.state.attributes));
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

  excludeArrayBfromArrayA(a: AttributeListing[], b: AttributeListing[]): AttributeListing[] {
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
