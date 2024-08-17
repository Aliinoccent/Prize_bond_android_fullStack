import { StyleSheet } from "react-native";
import COLORS from "../consts/color";

const STYLES = StyleSheet.create({
  inputContainer: {
    marginStart: 30,
    marginEnd: 30,
    // flexDirection: "row",
    marginTop: 20,
  },
  input: {
    color: COLORS.blue,
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderColor: COLORS.light,
    borderBottomWidth: 0.5,
    flex: 1,
    fontSize: 18,
  },
  inputIcon: {
    marginTop: 15,
    position: "absolute",
  },
  btnPrimary: {
    backgroundColor: COLORS.blue,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  line: {
    alignItems:'center',
    width: 50,
    borderWidth: 1,
    color: COLORS.light,
  },
 
  
});

export default STYLES;
