import {
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
    console.log(primaryAttributes);
    return (
      <Card>
        <CardHeader title="Compound Outputs" />
        <CardContent>
          <List className="compound-primary">
            {primaryAttributes.map((attribute) => {
              return (
                <React.Fragment>
                  <ListItem>
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
                        />
                      )}
                      onChange={this.handleChangePrimaryProvider(attribute)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <div>
                    {/* START Secondary Attributes Display */}
                    <List className="compound-secondary">
                      {attribute.secondaryAttributes!.map((secondary) => {
                        return (
                          <ListItem>
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
                    </List>
                    {/* END Secondary Attributes Display */}
                  </div>
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  handleChangePrimaryProvider = (attribute: AttributeListing) => (
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
