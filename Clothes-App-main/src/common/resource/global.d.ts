import FontAwesome from "@expo/vector-icons/FontAwesome";

type TabScreen = {
    name: string;
    title: string;
    icon: keyof typeof FontAwesome.glyphMap;
}