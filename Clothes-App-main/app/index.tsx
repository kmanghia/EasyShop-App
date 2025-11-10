import { Routes } from "@/src/common/resource/routes";
import { Redirect } from "expo-router";

export default function TabsIndex() {
    return <Redirect href={Routes.WELCOME_INTRO} />;
}
