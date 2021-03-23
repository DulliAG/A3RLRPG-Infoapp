import React from "react";
import RLRPG_LOGO from "../assets/images/rlrpg-logo.png";
// Components
import { View, Text, Image, StyleSheet } from "react-native";

const CreditCard = (props) => {
  const { company, iban, owner, balance } = props;
  return (
    <View style={[styles.creditCard, company ? styles.company : styles.private]}>
      <Text style={styles.bankName}>NH-Bank</Text>
      <Image style={styles.logo} source={RLRPG_LOGO} />
      <View style={styles.formGroup}>
        <Text style={styles.label}>IBAN</Text>
        <Text style={styles.field}>{iban}</Text>
      </View>
      <View style={{ ...styles.row, justifyContent: "space-between", marginTop: 16 }}>
        <View style={{ ...styles.formGroup, width: "55%" }}>
          <Text style={styles.label}>Inhaber</Text>
          <Text style={styles.field}>{owner}</Text>
        </View>
        <View style={{ ...styles.formGroup, width: "40%" }}>
          <Text style={styles.label}>Kontostand</Text>
          <Text style={styles.field}>{balance}</Text>
        </View>
      </View>
    </View>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  creditCard: {
    width: "95%",
    marginBottom: 16,
    marginHorizontal: "2.5%",
    padding: 16,
    borderRadius: 8,
  },
  company: { backgroundColor: "#1a83ff" },
  private: {
    backgroundColor: "#28a745",
  },
  logo: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 50,
    height: 50,
  },
  bankName: {
    marginBottom: 12,
    fontWeight: "bold",
    fontSize: 22,
    color: "#fff",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  formGroup: {},
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
  field: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, .4)",
    color: "#fff",
  },
});
