import React from "react";
import {
  AsyncStorage,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
} from "react-native";
import strings from "../res/strings";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor() {
    super();
    this.state = {
      number: "pi",
      pi: strings.pi.slice(0, 1000),
      piObj: [],
      chunkSize: 4,
      offset: 0,
      startAtTenths: false,
      count: 0
    };
  }

  setData = async () => {
    try {
      this.setState(
        {
          number: (await AsyncStorage.getItem("number")) || "pi",
          offset: parseInt(await AsyncStorage.getItem("offset")) || 0,
          startAtTenths:
            (await AsyncStorage.getItem("startAtTenths")) == "true" || false
        },
        () => {
          this.setState(
            {
              pi: strings[this.state.number].slice(0, 1000)
            },
            () => {
              this.init();
            }
          );
        }
      );
    } catch (e) {}
  };

  componentDidMount() {
    this.setData();
  }

  // store settings in AsyncStorage
  storeData = async () => {
    try {
      await AsyncStorage.multiSet([
        ["number", this.state.number],
        ["offset", this.state.offset.toString()],
        ["startAtTenths", this.state.startAtTenths.toString()]
      ]);
    } catch (e) {}
  };

  updateSettings = (offset, startAtTenths, number) => {
    this.setState(
      {
        offset,
        startAtTenths,
        number,
        pi: strings[number].slice(0, 1000)
      },
      () => {
        this.storeData();
        this.init();
      }
    );
  };

  init = () => {
    count = 0;
    piObj = [];
    // turn pi into obj chunks
    while (1) {
      rowDigits = [];
      for (i = 0; i < 2; i++) {
        blockDigits = [];
        for (j = 0; j < 2; j++) {
          piChunk = this.getChunk(count++);
          if (piChunk === "") break;
          blockDigits.push(piChunk);
        }
        if (piChunk === "") break;
        rowDigits.push(blockDigits);
      }
      if (piChunk === "") break;

      piObj.push({
        key: count.toString(),
        digits: rowDigits
      });
    }

    this.setState({
      piObj
    });
  };

  // get the next chunk of pi
  getChunk = count => {
    // Start this far in pi
    offset = this.state.offset === 0 ? 0 : this.state.offset;
    if (this.state.startAtTenths) offset += 2;

    // special case if getting 3.14... block (get additional digit to compensate for '.')
    if (count === 0 && this.state.offset === 0) {
      startAtTenths = this.state.startAtTenths ? 0 : 1;
      return this.state.pi.slice(
        offset,
        this.state.chunkSize + offset + startAtTenths
      );
    }

    startAtTenths = this.state.startAtTenths ? 0 : 1;

    start = this.state.chunkSize * count + offset + startAtTenths;
    return this.state.pi.slice(start, start + this.state.chunkSize);
  };

  render() {
    return (
      <View style={styles.rootContainer}>
        {/* Logo */}
        <Image style={styles.icon} source={require("../assets/icon.png")} />

        {/* Start Button */}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() =>
            this.props.navigation.navigate("PiPage", {
              piObj: this.state.piObj
            })
          }
        >
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() =>
            this.props.navigation.navigate("Settings", {
              updateSettings: this.updateSettings,
              number: this.state.number,
              offset: this.state.offset,
              startAtTenths: this.state.startAtTenths
            })
          }
        >
          <Text style={styles.buttonText}>SETTINGS</Text>
        </TouchableOpacity>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#505050"
  },
  icon: {
    // flex: 1,
    marginLeft: "20%",
    marginRight: "25%",
    width: null,
    height: "50%",
    resizeMode: "contain"
  },
  logo: {
    position: "absolute",
    bottom: Dimensions.get("window").width * 0.05,
    right: Dimensions.get("window").width * 0.05,
    width: Dimensions.get("window").width * 0.15,
    height: Dimensions.get("window").width * 0.15 * (118 / 150)
  },
  buttonStyle: {
    // width: 100,
    // height: 50,
    backgroundColor: "white",
    alignItems: "center",
    padding: 10,
    marginTop: "10%",
    marginLeft: "30%",
    marginRight: "30%",
    borderRadius: 5
  },
  buttonText: {
    color: "black",
    fontWeight: "bold"
  }
});
