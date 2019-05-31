import React from "react";
import {
  Alert,
  Button,
  Image,
  ListView,
  Picker,
  Platform,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.name !== r2.name
    });
    this.state = {
      number: "pi",
      startAt: this.props.offset === 0 ? "1" : parseInt(this.props.offset),
      beginAt3: false,
      dataSource: ds.cloneWithRows(require("../res/options.json"))
    };
  }

  numberPicker() {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.subtitle}>Number: </Text>
        <Picker
          selectedValue={(this.state && this.state.number) || "e"}
          style={{ height: 25, width: 100 }}
          itemStyle={{ textAlign: "center" }}
          onValueChange={newValue =>
            this.setState({
              number: newValue
            })
          }
        >
          <Picker.Item key="pi" label="pi" value="pi" />
          <Picker.Item key="tao" label="tao" value="tao" />
          <Picker.Item key="e" label="e" value="e" />
        </Picker>
      </View>
    );
  }

  startSelector() {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.subtitle}>Start at: </Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={this.state.startAt}
          maxLength={3}
          onChangeText={text => {
            numText = text.replace(/[^0-9]/g, "");
            while (numText != "" && numText[0] === "0") {
              numText = numText.slice(1);
            }
            this.setState({
              startAt: numText
            });
          }}
        />
      </View>
    );
  }

  startAtToggle() {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.subtitle}>First digit: </Text>
        <View style={{ flexDirection: "row" }}>
          <Text>3</Text>
          <Switch
            value={this.state.beginAt3}
            onValueChange={beginAt3 => this.setState({ beginAt3 })}
          />
          <Text>1</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Settings</Text>
        {this.numberPicker()}
        <View style={styles.hRule} />
        {this.startAtToggle()}
        {this.startSelector()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    flexDirection: "column"
  },
  title: {
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center"
  },
  subtitle: {
    fontSize: 18,
    paddingRight: 10
  },
  rowContainer: {
    marginLeft: "5%",
    marginRight: "25%",
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  hRule: {
    marginTop: 10,
    marginLeft: "15%",
    marginRight: "15%",
    marginBottom: 10,
    height: 1,
    backgroundColor: "black"
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 5,
    textAlign: "center",
    width: 50
  }
});
