import { CommonColors } from "@/src/common/resource/colors"
import { FlatList, Image, StyleSheet, View } from "react-native"

type Props = {
    images: string[],
    preImage: string
}

const AvailableVariantImagesComponent = ({ images, preImage }: Props) => {

    return (
        <FlatList
            data={images}
            keyExtractor={(item) => item}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }}></View>}
            renderItem={({ item, index }) => (
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: `${preImage}/${item}` }}
                        style={styles.imageItem}
                    />
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    imageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: CommonColors.extraLightGray
    },
    imageItem: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    }
});

export default AvailableVariantImagesComponent;