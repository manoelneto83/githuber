import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import styles from "./styles";
import { colors } from "~/styles";
import api from "~/services/api";

export default class Welcome extends Component {
  state = {
    username: "",
    loading: false,
  };

  checkUsersExists = async (username) => {
    const user = await api.get(`/users/${username}`);

    return user;
  };

  saveUser = async (username) => {
    await AsyncStorage.setItem("@Githuber:username", username);
  };

  signIn = async () => {
    const { username } = this.state;
    const { navigation } = this.props;

    this.setState({ loading: true });

    try {
      await this.checkUsersExists(username);
      await this.saveUser(username);
      navigation.navigate("Repositories");
    } catch (err) {
      this.setState({ loading: false });
      console.tron.log("usuário inexistente");
    }
  };

  render() {
    const { username, loading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.secundary} />
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.text}>
          Para continuar precisamos que você informe o seu usuário do github.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Digite o seu usuário"
            underlineColorAndroid={colors.transparent}
            value={username}
            onChangeText={(text) => this.setState({ username: text })}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.signIn}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Prosseguir</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
