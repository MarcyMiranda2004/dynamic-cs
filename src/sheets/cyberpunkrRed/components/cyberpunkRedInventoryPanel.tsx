import {useState} from "react";
import {CheckIcon, PencilIcon} from "lucide-react";
import DeleteButton from "../../../components/common/DeleteButton";
import Modal from "../../../components/common/Modal";
import ClickableTable from "../../../components/common/ClickableTable";
import PanelHeading from "../../../components/common/PanelHeading";
import {AddButton} from "../../../components/common/SectionButtons";
import {InlineNumber, TextField} from "../../../components/common/EditableField";
import {useNumberDraft} from "../../../components/common/useNumberDraft";
import type {Armor, ArmorSlot, EquipmentItem, Weapon} from "../utils/CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../utils/cyberpunkRedSheetContext";
import {removeAt, replaceAt} from "../../../utils/list";

const BLANK_WEAPON: Weapon = {name: "", damage: "", shots: "", rof: "", ammo: "", notes: ""};
const BLANK_ITEM: EquipmentItem = {item: "", description: "", notes: ""};

const ARMOR_ROWS: {key: keyof Armor; label: string}[] = [
    {key: "head", label: "Testa"},
    {key: "body", label: "Corpo"},
    {key: "shield", label: "Scudo"},
];

const WEAPON_COLUMNS = "minmax(0,2fr) 0.8fr 0.8fr 0.8fr minmax(0,1.2fr)";
const ARMOR_COLUMNS = "[--cols:minmax(0,1.6fr)_1fr_1fr]";

const InventoryPanel = () => (
    <div className="grid gap-3 md:grid-cols-2">
        <WeaponsSection/>
        <ArmorSection/>
        <EquipmentSection/>
    </div>
);
export default InventoryPanel;

// #region ARMI 

const WeaponsSection = () => {
    const {sheet, update} = useSheet();
    const [selected, setSelected] = useState<number | null>(null);

    const addWeapon = () => {
        const newIndex = sheet.weapons.length;
        update((s) => ({...s, weapons: [...s.weapons, {...BLANK_WEAPON}]}));
        setSelected(newIndex);
    };

    return (
        <section className="sectionClass md:col-span-2" aria-label="Armi">
            <PanelHeading title="Armi" action={<AddButton onClick={addWeapon}/>}/>
            <ClickableTable
                rows={sheet.weapons}
                onOpen={setSelected}
                emptyLabel="Nessuna arma"
                widths={WEAPON_COLUMNS}
                columns={[
                    {header: "Arma", render: (weapon) => weapon.name || "—"},
                    {header: "DAN", render: (weapon) => weapon.damage || "—"},
                    {header: "Colpi", render: (weapon) => weapon.shots || "—"},
                    {header: "CF", render: (weapon) => weapon.rof || "—"},
                    {header: "Munizioni", render: (weapon) => weapon.ammo || "—"},
                ]}
            />

            {selected !== null && sheet.weapons[selected] && (
                <WeaponModal index={selected} onClose={() => setSelected(null)}/>
            )}
        </section>
    );
};

const WeaponModal = ({index, onClose}: {index: number; onClose: () => void}) => {
    const {sheet, update} = useSheet();
    const weapon = sheet.weapons[index];

    const patch = (values: Partial<Weapon>) => update(
        (s) => ({...s, weapons: replaceAt(s.weapons, index, {...s.weapons[index], ...values})})
    );

    const remove = () => {
        update((s) => ({...s, weapons: removeAt(s.weapons, index)}));
        onClose();
    };

    return (
        <Modal title={weapon.name || "Arma"} onClose={onClose} footer={<DeleteButton label="Elimina arma" onClick={remove}/>}>
            <TextField label="Arma" value={weapon.name} onChange={(name) => patch({name})}/>

            <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="DAN" value={weapon.damage} onChange={(damage) => patch({damage})}/>
                <TextField label="Colpi" value={weapon.shots} onChange={(shots) => patch({shots})}/>
                <TextField label="CF" value={weapon.rof} onChange={(rof) => patch({rof})}/>
                <TextField label="Munizioni" value={weapon.ammo} onChange={(ammo) => patch({ammo})}/>
            </div>

            <TextField label="Note" value={weapon.notes} multiline onChange={(notes) => patch({notes})}/>
        </Modal>
    );
};
// #endregion

// #region ARMATURE 
const ArmorSection = () => {
    const {sheet, update} = useSheet();
    const [editing, setEditing] = useState(false);

    const patchSlot = (key: keyof Armor, values: Partial<ArmorSlot>) => update(
        (s) => ({...s, armor: {...s.armor, [key]: {...s.armor[key], ...values}}})
    );

    return (
        <section className="sectionClass" aria-label="Armature">
            <PanelHeading
                title="Armature"
                action={
                    <button 
                        type="button" 
                        aria-pressed={editing} 
                        onClick={() => setEditing((value) => !value)}
                        className="compactButtonClass"
                    >
                        {editing ? <CheckIcon size={14} aria-hidden="true"/> : <PencilIcon size={14} aria-hidden="true"/>}
                        {editing ? "Fine" : "Modifica"}
                    </button>
                }
            />
            <div className={`tableClass ${ARMOR_COLUMNS}`}>
                <div className="rowHeadClass">
                    <span>Armatura</span>
                    <span>PA</span>
                    <span>Penalità</span>
                </div>

                {ARMOR_ROWS.map(({key, label}) => {
                    const slot = sheet.armor[key];

                    return (
                        <div key={key} className="rowClass">
                            <span className="cellClass flex min-h-9 items-center gap-1.5">
                                <strong>{label}</strong>
                                {editing ? (
                                    <>
                                        <span aria-hidden="true">-</span>
                                        <input
                                            className="inputClass min-h-9 flex-1"
                                            aria-label={`Nome del pezzo: ${label}`}
                                            placeholder="Nome del pezzo"
                                            value={slot.name}
                                            onChange={(event) => patchSlot(key, {name: event.target.value})}
                                        />
                                    </>
                                ) : (
                                    slot.name && <span className="opacity-80">- {slot.name}</span>
                                )}
                            </span>

                            {editing ? (
                                <InlineNumber 
                                    label="PA" 
                                    value={slot.armorValue}
                                    onChange={(armorValue) => patchSlot(key, {armorValue})}
                                />
                            ) : (
                                <span className="cellClass flex min-h-9 items-center" data-label="PA">{slot.armorValue}</span>
                            )}

                            {editing ? (
                                <InlineNumber 
                                    label="Penalità" 
                                    value={slot.penalty}
                                    onChange={(penalty) => patchSlot(key, {penalty})}
                                />
                            ) : (
                                <span className="cellClass flex min-h-9 items-center" data-label="Penalità">{slot.penalty}</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <p className="m-0 text-[0.85em] italic opacity-70">La penalità si applica a RIF, DES e VEL.</p>
        </section>
    );
};
//#endregion

// #region EQUIPAGGIAMENTO E DENARO
const EquipmentSection = () => {
    const {sheet, update} = useSheet();
    const [selected, setSelected] = useState<number | null>(null);

    const money = useNumberDraft(sheet.equipment.money, (value) => update(
        (s) => ({...s, equipment: {...s.equipment, money: value}})
    ));

    const addItem = () => {
        const newIndex = sheet.equipment.items.length;
        update((s) => ({...s, equipment: {...s.equipment, items: [...s.equipment.items, {...BLANK_ITEM}]}}));
        setSelected(newIndex);
    };

    return (
        <section className="sectionClass grid-rows-[1fr_auto]" aria-label="Equipaggiamento">
            <div className="grid content-start gap-2">
                <PanelHeading title="Equipaggiamento" action={<AddButton onClick={addItem}/>}/>
                <ClickableTable
                    rows={sheet.equipment.items}
                    onOpen={setSelected}
                    emptyLabel="Nessun equipaggiamento"
                    widths="minmax(0,1fr) minmax(0,1fr)"
                    columns={[
                        {header: "Equipaggiamento", render: (item) => item.item || "—"},
                        {
                            header: "Note",
                            render: (item) => item.notes || "—",
                            className: "line-clamp-2 text-right max-sm:text-left opacity-80",
                        },
                    ]}
                />

                {selected !== null && sheet.equipment.items[selected] && (
                    <EquipmentModal index={selected} onClose={() => setSelected(null)}/>
                )}
            </div>

            <label className="flex items-center justify-between gap-3 bg-cpr-red px-3.5 py-2 text-white shadow-[0_0_18px_rgb(215_38_46/0.5)]">
                <span className="font-extrabold tracking-widest uppercase">Denaro</span>
                <input
                    className="w-36 border-0 border-b border-white bg-transparent text-right font-mono text-[1.4rem] text-white focus-visible:outline-none"
                    type="number"
                    inputMode="numeric"
                    {...money}
                />
            </label>
        </section>
    );
};

const EquipmentModal = ({index, onClose}: {index: number; onClose: () => void}) => {
    const {sheet, update} = useSheet();
    const item = sheet.equipment.items[index];

    const patch = (values: Partial<EquipmentItem>) => update((s) => ({
        ...s,
        equipment: {
            ...s.equipment,
            items: replaceAt(s.equipment.items, index, {...s.equipment.items[index], ...values}),
        },
    }));

    const remove = () => {
        update((s) => ({...s, equipment: {...s.equipment, items: removeAt(s.equipment.items, index)}}));
        onClose();
    };

    return (
        <Modal title={item.item || "Equipaggiamento"} onClose={onClose} footer={<DeleteButton label="Elimina" onClick={remove}/>}>
            {item.image && <img className="max-h-60 w-full border border-ui-overlay-line object-cover" src={item.image} alt={item.item}/>}

            <TextField 
                label="Nome" 
                value={item.item} 
                onChange={(value) => patch({item: value})}
            />

            <TextField 
                label="Descrizione" 
                value={item.description} 
                multiline 
                onChange={(description) => patch({description})}
            />

            <TextField 
                label="Note" 
                value={item.notes} 
                multiline onChange={(notes) => patch({notes})}
            />

            <TextField 
                label="URL immagine" 
                value={item.image ?? ""} 
                placeholder="https://..."
                onChange={(image) => patch({image: image || undefined})}
            />
        </Modal>
    );
};
