import {useState} from "react";
import {Plus} from "lucide-react";
import DeleteButton from "../../../components/common/DeleteButton";
import Modal from "../../../components/common/Modal";
import {InlineNumber, TextField} from "../../../components/common/EditableField";
import {
    buttonClass,
    cellClass,
    panelTitleClass,
    rowButtonClass,
    rowClass,
    rowHeadClass,
    sectionClass,
    tableClass,
} from "../../../components/common/ui";
import type {Armor, EquipmentItem, Weapon} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";
import {removeAt, replaceAt} from "../sheetState";

const BLANK_WEAPON: Weapon = {name: "", damage: "", shots: "", rof: "", ammo: "", notes: ""};
const BLANK_ITEM: EquipmentItem = {item: "", description: "", notes: ""};

const ARMOR_ROWS: {key: keyof Armor; label: string}[] = [
    {key: "head", label: "Testa"},
    {key: "body", label: "Corpo"},
    {key: "shield", label: "Scudo"},
];

const WEAPON_COLUMNS = "[--cols:minmax(0,2fr)_0.8fr_0.8fr_0.8fr_minmax(0,1.2fr)]";
const ARMOR_COLUMNS = "[--cols:minmax(0,1.2fr)_1fr_1fr]";
// Righe a cella singola (equipaggiamento, messaggi vuoti): non ereditano le colonne della tabella
const SINGLE_COLUMN = "[--cols:1fr]";

const InventoryPanel = () => {
    const {sheet, editMode, update} = useSheet();

    return (
        <div className="grid gap-3 md:grid-cols-2">
            <WeaponsSection/>

            <section className={sectionClass} aria-label="Armature">
                <h3 className={panelTitleClass}>Armature</h3>
                <div className={`${tableClass} ${ARMOR_COLUMNS}`}>
                    <div className={rowHeadClass}>
                        <span>Armatura</span>
                        <span>PA</span>
                        <span>Penalità</span>
                    </div>
                    {ARMOR_ROWS.map(({key, label}) => (
                        <div key={key} className={rowClass}>
                            <span className={cellClass}><strong>{label}</strong></span>
                            <InlineNumber
                                label="PA"
                                value={sheet.armor[key].armorValue}
                                editMode={editMode}
                                onChange={(armorValue) =>
                                    update((s) => ({
                                        ...s,
                                        armor: {...s.armor, [key]: {...s.armor[key], armorValue}},
                                    }))
                                }
                            />
                            <InlineNumber
                                label="Penalità"
                                value={sheet.armor[key].penalty}
                                editMode={editMode}
                                onChange={(penalty) =>
                                    update((s) => ({
                                        ...s,
                                        armor: {...s.armor, [key]: {...s.armor[key], penalty}},
                                    }))
                                }
                            />
                        </div>
                    ))}
                </div>
                <p className="m-0 text-[0.85em] italic opacity-70">La penalità si applica a RIF, DES e VEL.</p>
            </section>

            <EquipmentSection/>
        </div>
    );
};
export default InventoryPanel;

// ---------- Armi ----------

const WeaponsSection = () => {
    const {sheet, editMode, update} = useSheet();
    const [selected, setSelected] = useState<number | null>(null);

    const addWeapon = () => {
        const newIndex = sheet.weapons.length;
        update((s) => ({...s, weapons: [...s.weapons, {...BLANK_WEAPON}]}));
        setSelected(newIndex);
    };

    return (
        <section className={`${sectionClass} md:col-span-2`} aria-label="Armi">
            <h3 className={panelTitleClass}>Armi</h3>
            <div className={`${tableClass} ${WEAPON_COLUMNS}`}>
                <div className={rowHeadClass}>
                    <span>Arma</span>
                    <span>DAN</span>
                    <span>Colpi</span>
                    <span>CF</span>
                    <span>Munizioni</span>
                </div>

                {sheet.weapons.length === 0 && <p className={`${rowClass} ${SINGLE_COLUMN} m-0 opacity-70`}>Nessuna arma</p>}

                {sheet.weapons.map((weapon, index) => (
                    <button key={index} type="button" onClick={() => setSelected(index)} className={`${rowClass} ${rowButtonClass}`}>
                        <span className={cellClass}><strong>{weapon.name || "—"}</strong></span>
                        <span className={cellClass} data-label="DAN">{weapon.damage || "—"}</span>
                        <span className={cellClass} data-label="Colpi">{weapon.shots || "—"}</span>
                        <span className={cellClass} data-label="CF">{weapon.rof || "—"}</span>
                        <span className={cellClass} data-label="Munizioni">{weapon.ammo || "—"}</span>
                    </button>
                ))}
            </div>

            {editMode && (
                <button type="button" onClick={addWeapon} className={`${buttonClass} justify-self-start`}>
                    <Plus size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Aggiungi arma
                </button>
            )}

            {selected !== null && sheet.weapons[selected] && (
                <WeaponModal index={selected} onClose={() => setSelected(null)}/>
            )}
        </section>
    );
};

const WeaponModal = ({index, onClose}: {index: number; onClose: () => void}) => {
    const {sheet, editMode, update} = useSheet();
    const weapon = sheet.weapons[index];

    const patch = (values: Partial<Weapon>) =>
        update((s) => ({...s, weapons: replaceAt(s.weapons, index, {...s.weapons[index], ...values})}));

    const remove = () => {
        update((s) => ({...s, weapons: removeAt(s.weapons, index)}));
        onClose();
    };

    return (
        <Modal
            title={weapon.name || "Arma"}
            onClose={onClose}
            footer={editMode && <DeleteButton label="Elimina arma" onClick={remove}/>}
        >
            <TextField label="Arma" value={weapon.name} editMode={editMode} onChange={(name) => patch({name})}/>
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="DAN" value={weapon.damage} editMode={editMode} onChange={(damage) => patch({damage})}/>
                <TextField label="Colpi" value={weapon.shots} editMode={editMode} onChange={(shots) => patch({shots})}/>
                <TextField label="CF" value={weapon.rof} editMode={editMode} onChange={(rof) => patch({rof})}/>
                <TextField label="Munizioni" value={weapon.ammo} editMode={editMode} onChange={(ammo) => patch({ammo})}/>
            </div>
            <TextField label="Note" value={weapon.notes} multiline editMode={editMode} onChange={(notes) => patch({notes})}/>
        </Modal>
    );
};

// ---------- Equipaggiamento e denaro ----------

const EquipmentSection = () => {
    const {sheet, editMode, update} = useSheet();
    const [selected, setSelected] = useState<number | null>(null);

    const addItem = () => {
        const newIndex = sheet.equipment.items.length;
        update((s) => ({...s, equipment: {...s.equipment, items: [...s.equipment.items, {...BLANK_ITEM}]}}));
        setSelected(newIndex);
    };

    return (
        // La lista occupa tutto lo spazio libero e il denaro resta in fondo alla sezione, anche se la card accanto è più alta
        <section className={`${sectionClass} grid-rows-[1fr_auto]`} aria-label="Equipaggiamento">
            <div className="grid content-start gap-2">
                <h3 className={panelTitleClass}>Equipaggiamento</h3>
                <div className={tableClass}>
                    {sheet.equipment.items.length === 0 && <p className={`${rowClass} ${SINGLE_COLUMN} m-0 opacity-70`}>Nessun equipaggiamento</p>}

                    {sheet.equipment.items.map((item, index) => (
                        <button key={index} type="button" onClick={() => setSelected(index)} className={`${rowClass} ${SINGLE_COLUMN} ${rowButtonClass}`}>
                            <span className={cellClass}><strong>{item.item || "—"}</strong></span>
                        </button>
                    ))}
                </div>

                {editMode && (
                    <button type="button" onClick={addItem} className={`${buttonClass} justify-self-start`}>
                        <Plus size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Aggiungi equipaggiamento
                    </button>
                )}

                {selected !== null && sheet.equipment.items[selected] && (
                    <EquipmentModal index={selected} onClose={() => setSelected(null)}/>
                )}
            </div>

            <div className="flex items-center justify-between gap-3 bg-cpr-red px-3.5 py-2 text-white shadow-[0_0_18px_rgb(215_38_46/0.5)]">
                <span className="font-extrabold tracking-widest uppercase">Denaro</span>
                {editMode ? (
                    <input
                        className="w-36 border-0 border-b border-white bg-transparent text-right font-mono text-[1.4rem] text-white focus-visible:outline-none"
                        type="number"
                        inputMode="numeric"
                        aria-label="Denaro"
                        value={sheet.equipment.money}
                        onChange={(event) => {
                            const money = Number(event.target.value) || 0;
                            update((s) => ({...s, equipment: {...s.equipment, money}}));
                        }}
                    />
                ) : (
                    <strong className="font-mono text-[1.6rem]">{sheet.equipment.money}</strong>
                )}
            </div>
        </section>
    );
};

const EquipmentModal = ({index, onClose}: {index: number; onClose: () => void}) => {
    const {sheet, editMode, update} = useSheet();
    const item = sheet.equipment.items[index];

    const patch = (values: Partial<EquipmentItem>) =>
        update((s) => ({
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
        <Modal
            title={item.item || "Equipaggiamento"}
            onClose={onClose}
            footer={editMode && <DeleteButton label="Elimina" onClick={remove}/>}
        >
            {item.image && <img className="max-h-60 w-full border border-[#5a1116] object-cover" src={item.image} alt={item.item}/>}
            <TextField label="Nome" value={item.item} editMode={editMode} onChange={(value) => patch({item: value})}/>
            <TextField label="Descrizione" value={item.description} multiline editMode={editMode}
                       onChange={(description) => patch({description})}/>
            <TextField label="Note" value={item.notes} multiline editMode={editMode}
                       onChange={(notes) => patch({notes})}/>
            <TextField label="URL immagine" value={item.image ?? ""} editMode={editMode}
                       placeholder="https://..." onChange={(image) => patch({image: image || undefined})}/>
        </Modal>
    );
};
