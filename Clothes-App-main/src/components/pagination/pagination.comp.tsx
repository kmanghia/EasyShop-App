import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet, Text, View } from "react-native"

type Props = {
    items: string[];
    paginationIndex: number;
}

const PaginationComponent = ({ items, paginationIndex }: Props) => {
    return (
        <View style={styles.container}>
            {items.map((item, index) => (
                <View
                    key={item}
                    style={[styles.paginationDots, { backgroundColor: paginationIndex === index ? CommonColors.primary : '#ccc' }]}
                ></View>
            ))}
            <View style={styles.paginationNumberContainer}>
                <View style={styles.paginationNumberBox}>
                    <Text style={styles.paginationNumberTxt}>
                        {paginationIndex + 1}/{items.length}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paginationDots: {
        width: 30,
        height: 4,
        margin: 3,
        borderRadius: 5,
        backgroundColor: '#ccc'
    },
    paginationNumberContainer: {
        position: 'absolute',
        alignItems: 'flex-end',
        width: '100%',
        paddingRight: 20,
    },
    paginationNumberBox: {
        backgroundColor: CommonColors.extraLightGray,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10
    },
    paginationNumberTxt: {
        color: CommonColors.primary,
        fontSize: 13
    }

})

export default PaginationComponent;