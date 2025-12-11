import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";

type Props = {
    required?: boolean;
    type?: "text" | "email" | "password" | "number";
    value: string;
    placeholder: string;
    onChange: (text: string) => void;
};

export default function CustomInput({ type = "text", required, value, placeholder, onChange }: Props) {
  const [isSecureText, setIsSecureText] = useState(type === "password");
  const isPasswordField = type === "password";
  const { language } = useLanguage();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const icon = type === "email" ? "email" : type === "password" ? "lock" : "person";

    const keyboardType: KeyboardTypeOptions =
        type === "email" ? "email-address" :
        type === "number" ? "numeric" :
        "default";

    const getError = () => {
        if (type === "email" && value && !value.includes("@")) return i18n.t("invalidEmail");
        if (type === "password" && value && value.length < 6) return i18n.t("weakPassword");
        if (required && !value.trim()) return i18n.t("requiredField");
    };

    const error = getError();

    return (
        <View style={styles.wrapper}>
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: error ? colors.danger : colors.border,
                        backgroundColor: colors.card,
                    },
                ]}
            >
                <MaterialIcons name={icon as any} size={20} color={colors.textSecondary} />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.muted}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {}}
                    secureTextEntry={isPasswordField && isSecureText}
                    style={[styles.input, { color: colors.text }]}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />

                {isPasswordField && (
                    <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)}>
                        <Ionicons
                            name={isSecureText ? "eye" : "eye-off"}
                            size={22}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={[styles.inputErrorText, { color: colors.danger }]}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 13,
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: "80%",
    },
    inputErrorText: {
        marginTop: 4,
        fontSize: 12,
    },
});
