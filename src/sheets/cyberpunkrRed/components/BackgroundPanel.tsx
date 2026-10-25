import {useState} from "react";
import {Plus, X} from "lucide-react";
import DeleteButton from "../../../components/common/DeleteButton";
import EntryList, {type EntryItem} from "../../../components/common/EntryList";
import Modal from "../../../components/common/Modal";
import {TextField} from "../../../components/common/EditableField";
import Tile from "../../../components/common/Tile";
import {buttonClass, dangerButtonClass, inputClass} from "../../../components/common/ui";
import type {Background, Enemy, Relation, RoleBackgroundField} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";
import {removeAt, replaceAt} from "../sheetState";

type TextKey = keyof Pick<
    Background,
    | "originCulture" | "personality" | "clothingStyle" | "hairstyle"
    | "valuesMost" | "providesForOthers" | "personCaresMost" | "objectCaresMost"
    | "familyBackground" | "childhood" | "familyCrisis" | "lifeGoal"
>;

type SecondaryKey = keyof Pick<Background, "fashion" | "housing" | "rent" | "lifestyle">;
type RelationKey = "friends" | "tragicLoveStories";

const IDENTITY_FIELDS: {key: TextKey; label: string}[] = [
    {key: "originCulture", label: "Cultura di origine"},
    {key: "personality", label: "Personalità"},
    {key: "clothingStyle", label: "Stile di abbigliamento"},
    {key: "hairstyle", label: "Taglio di capelli"},
];

const VALUES_FIELDS: {key: TextKey; label: string}[] = [
    {key: "valuesMost", label: "A cosa dai più valore?"},
    {key: "providesForOthers", label: "Cosa provi per gli altri?"},
    {key: "personCaresMost", label: "Persona a cui tieni di più"},
    {key: "objectCaresMost", label: "Oggetto a cui tieni di più"},
];

const PAST_FIELDS: {key: TextKey; label: string}[] = [
    {key: "familyBackground", label: "Background familiare"},
    {key: "childhood", label: "La tua infanzia"},
    {key: "familyCrisis", label: "Crisi familiare"},
    {key: "lifeGoal", label: "Scopo nella vita"},
];

const SECONDARY_FIELDS: {key: SecondaryKey; label: string; multiline: boolean}[] = [
    {key: "fashion", label: "Moda", multiline: true},
    {key: "housing", label: "Alloggio", multiline: false},
    {key: "rent", label: "Affitto", multiline: false},
    {key: "lifestyle", label: "Stile di vita", multiline: false},
];

// Anteprima di una relazione: nome come titolo, legame e dettaglio come anteprima
const relationEntry = (relation: Relation): EntryItem => ({
    title: relation.name,
    preview: [relation.bond, relation.details].filter(Boolean).join(" · "),
});

type OpenEntry = {kind: RelationKey; index: number} | {kind: "enemy"; index: number} | null;

const BackgroundPanel = () => {
    const {sheet, editMode, update} = useSheet();
    const {background} = sheet;
    const [openEntry, setOpenEntry] = useState<OpenEntry>(null);

    const setText = (key: TextKey | SecondaryKey, value: string) =>
        update((s) => ({...s, background: {...s.background, [key]: value}}));

    const setRoleFields = (roleBackground: RoleBackgroundField[]) =>
        update((s) => ({...s, background: {...s.background, roleBackground}}));

    const setEnemies = (enemies: Enemy[]) =>
        update((s) => ({...s, background: {...s.background, enemies}}));

    const addRelation = (kind: RelationKey) => {
        const list = background[kind];
        update((s) => ({...s, background: {...s.background, [kind]: [...list, {name: "", bond: "", details: ""}]}}));
        setOpenEntry({kind, index: list.length});
    };

    const addEnemy = () => {
        setEnemies([...background.enemies, {who: "", why: "", canTrigger: "", whatHappens: ""}]);
        setOpenEntry({kind: "enemy", index: background.enemies.length});
    };

    const roleFields = background.roleBackground;

    const textTile = (title: string, fields: {key: TextKey; label: string}[]) => (
        <Tile key={title} title={title} className="md:col-span-2 xl:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(({key, label}) => (
                    <TextField
                        key={key}
                        label={label}
                        value={background[key]}
                        multiline
                        editMode={editMode}
                        onChange={(value) => setText(key, value)}
                    />
                ))}
            </div>
        </Tile>
    );

    return (
        // Mosaico: ruolo a tutta larghezza, poi amici, storie e nemici, biografia in coppie, descrizione in basso
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Tile title="Background di ruolo" className="border-[3px] md:col-span-2 xl:col-span-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {roleFields.map((field, index) =>
                        editMode ? (
                            <div key={index} className="grid content-start gap-2 border border-dashed border-cpr-red/35 p-2.5">
                                <div className="flex items-center gap-2">
                                    <input
                                        className={`${inputClass} flex-1 font-bold uppercase`}
                                        aria-label="Nome campo"
                                        value={field.label}
                                        onChange={(event) =>
                                            setRoleFields(replaceAt(roleFields, index, {...field, label: event.target.value}))
                                        }
                                    />
                                    <button
                                        type="button"
                                        aria-label="Rimuovi campo"
                                        onClick={() => setRoleFields(removeAt(roleFields, index))}
                                        className={`${buttonClass} ${dangerButtonClass} grid min-w-11 place-items-center px-0`}
                                    >
                                        <X size={16} aria-hidden="true"/>
                                    </button>
                                </div>
                                <TextField
                                    label="Valore"
                                    value={field.value}
                                    multiline
                                    editMode
                                    onChange={(value) => setRoleFields(replaceAt(roleFields, index, {...field, value}))}
                                />
                            </div>
                        ) : (
                            <TextField
                                key={index}
                                label={field.label}
                                value={field.value}
                                multiline
                                editMode={false}
                                onChange={() => undefined}
                            />
                        )
                    )}
                </div>

                {editMode && (
                    <button
                        type="button"
                        onClick={() => setRoleFields([...roleFields, {label: "Nuovo campo", value: ""}])}
                        className={`${buttonClass} justify-self-start`}
                    >
                        <Plus size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Campo
                    </button>
                )}
            </Tile>

            <Tile title="Amici">
                <EntryList
                    entries={background.friends.map(relationEntry)}
                    onOpen={(index) => setOpenEntry({kind: "friends", index})}
                    onAdd={editMode ? () => addRelation("friends") : undefined}
                    addLabel="Aggiungi amico"
                    emptyLabel="Nessun amico"
                />
            </Tile>

            <Tile title="Tragiche storie d'amore">
                <EntryList
                    entries={background.tragicLoveStories.map(relationEntry)}
                    onOpen={(index) => setOpenEntry({kind: "tragicLoveStories", index})}
                    onAdd={editMode ? () => addRelation("tragicLoveStories") : undefined}
                    addLabel="Aggiungi storia"
                    emptyLabel="Nessuna storia"
                />
            </Tile>

            <Tile title="Nemici" className="md:col-span-2 xl:col-span-2">
                <EntryList
                    layoutClassName="grid gap-2 sm:grid-cols-2"
                    entries={background.enemies.map((enemy) => ({
                        title: enemy.who,
                        preview: [enemy.why, enemy.canTrigger].filter(Boolean).join(" · "),
                    }))}
                    onOpen={(index) => setOpenEntry({kind: "enemy", index})}
                    onAdd={editMode ? addEnemy : undefined}
                    addLabel="Aggiungi nemico"
                    emptyLabel="Nessun nemico"
                />
            </Tile>

            {textTile("Identità", IDENTITY_FIELDS)}
            {textTile("Valori e legami", VALUES_FIELDS)}
            {textTile("Passato", PAST_FIELDS)}

            <Tile title="Info aggiuntive" className="md:col-span-2 xl:col-span-2">
                <div className="grid gap-3 sm:grid-cols-2">
                    {SECONDARY_FIELDS.map(({key, label, multiline}) => (
                        <TextField
                            key={key}
                            label={label}
                            value={background[key]}
                            multiline={multiline}
                            editMode={editMode}
                            onChange={(value) => setText(key, value)}
                        />
                    ))}
                </div>
            </Tile>

            <Tile title="Descrizione del personaggio" className="md:col-span-2 xl:col-span-4">
                <div className="min-h-64">
                    <TextField
                        label="Descrizione"
                        value={background.description}
                        multiline
                        editMode={editMode}
                        onChange={(description) => update((s) => ({...s, background: {...s.background, description}}))}
                    />
                </div>
            </Tile>

            {openEntry?.kind === "friends" || openEntry?.kind === "tragicLoveStories" ? (
                <RelationModal kind={openEntry.kind} index={openEntry.index} onClose={() => setOpenEntry(null)}/>
            ) : null}

            {openEntry?.kind === "enemy" && background.enemies[openEntry.index] && (
                <EnemyModal index={openEntry.index} onClose={() => setOpenEntry(null)}/>
            )}
        </div>
    );
};
export default BackgroundPanel;

// Modale di amico o storia d'amore: nome, legame e dettaglio
const RelationModal = ({kind, index, onClose}: {kind: RelationKey; index: number; onClose: () => void}) => {
    const {sheet, editMode, update} = useSheet();
    const relation = sheet.background[kind][index];
    if (!relation) return null;

    const patch = (values: Partial<Relation>) =>
        update((s) => ({
            ...s,
            background: {
                ...s.background,
                [kind]: replaceAt(s.background[kind], index, {...s.background[kind][index], ...values}),
            },
        }));

    const remove = () => {
        update((s) => ({...s, background: {...s.background, [kind]: removeAt(s.background[kind], index)}}));
        onClose();
    };

    const isFriend = kind === "friends";

    return (
        <Modal
            title={relation.name || (isFriend ? "Amico" : "Tragica storia d'amore")}
            onClose={onClose}
            footer={editMode && <DeleteButton label="Elimina" onClick={remove}/>}
        >
            <TextField label="Nome" value={relation.name} editMode={editMode} onChange={(name) => patch({name})}/>
            <TextField
                label="Legame"
                value={relation.bond}
                editMode={editMode}
                placeholder={isFriend ? "es. amico d'infanzia" : "es. ex partner"}
                onChange={(bond) => patch({bond})}
            />
            <TextField label="Dettaglio" value={relation.details} multiline editMode={editMode}
                       onChange={(details) => patch({details})}/>
        </Modal>
    );
};

const EnemyModal = ({index, onClose}: {index: number; onClose: () => void}) => {
    const {sheet, editMode, update} = useSheet();
    const enemy = sheet.background.enemies[index];

    const patch = (values: Partial<Enemy>) =>
        update((s) => ({
            ...s,
            background: {
                ...s.background,
                enemies: replaceAt(s.background.enemies, index, {...s.background.enemies[index], ...values}),
            },
        }));

    const remove = () => {
        update((s) => ({...s, background: {...s.background, enemies: removeAt(s.background.enemies, index)}}));
        onClose();
    };

    return (
        <Modal
            title={enemy.who || "Nemico"}
            onClose={onClose}
            footer={editMode && <DeleteButton label="Elimina nemico" onClick={remove}/>}
        >
            <TextField label="Chi?" value={enemy.who} editMode={editMode} onChange={(who) => patch({who})}/>
            <TextField label="Perché?" value={enemy.why} multiline editMode={editMode} onChange={(why) => patch({why})}/>
            <TextField label="Cosa può scatenarti contro?" value={enemy.canTrigger} multiline editMode={editMode}
                       onChange={(canTrigger) => patch({canTrigger})}/>
            <TextField label="Cosa accadrà?" value={enemy.whatHappens} multiline editMode={editMode}
                       onChange={(whatHappens) => patch({whatHappens})}/>
        </Modal>
    );
};
