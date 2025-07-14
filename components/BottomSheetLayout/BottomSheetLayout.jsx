import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

function BottomSheetLayout({ children, ref, snapPoints }) {
    

    return (
        <BottomSheet
            ref={ref}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            enableContentPanningGesture={true}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <BottomSheetView
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </BottomSheetView>
        </BottomSheet>
    );
}

export default BottomSheetLayout;