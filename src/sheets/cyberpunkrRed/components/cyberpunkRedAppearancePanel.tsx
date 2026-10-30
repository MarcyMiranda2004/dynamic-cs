import type {LabeledField} from "@/types/sheet";
import {useSheet} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedSheetContext";
import {DynamicFieldsSection, FieldsSection} from "@/components/common/FieldsSection";

// Aspetto del personaggio: moda a campi estendibili (sopra, sotto, giacca...) e descrizione fisica
const AppearancePanel = () => {
    const {sheet, update} = useSheet();
    const {appearance} = sheet;

    const setFashion = (fashion: LabeledField[]) => update((s) => (
        {...s, appearance: {...s.appearance, fashion}}
    ));

    return (
        <div className="grid gap-3">
            <DynamicFieldsSection 
                title="Moda" 
                fields={appearance.fashion} 
                onChange={setFashion}
                className="border-[3px]"
            />

            <FieldsSection
                title="Descrizione fisica"
                columnsClassName=""
                clampClassName="line-clamp-10"
                fields={[{
                    label: "Descrizione fisica",
                    value: appearance.physicalDescription,
                    onChange: (physicalDescription) => update(
                        (s) => ({...s, appearance: {...s.appearance, physicalDescription}})
                    ),
                }]}
            />
        </div>
    );
};
export default AppearancePanel;
