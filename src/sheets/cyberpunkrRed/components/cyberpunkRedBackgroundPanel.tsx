import {useState} from "react";
import ClickableTable from "../../../components/common/ClickableTable";
import DeleteButton from "../../../components/common/DeleteButton";
import EntryList, {type EntryItem} from "../../../components/common/EntryList";
import Modal from "../../../components/common/Modal";
import {AddButton} from "../../../components/common/SectionButtons";
import {TextField} from "../../../components/common/EditableField";
import Tile from "../../../components/common/Tile";
import type {LabeledField} from "../../../types/sheet";
import type {Background, Enemy, Relation} from "../utils/CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../utils/cyberpunkRedSheetContext";
import {removeAt, replaceAt} from "../../../utils/list";
import {DynamicFieldsSection, FieldsSection} from "../../../components/common/FieldsSection";

type TextKey = keyof Pick<
    Background,
    | "originCulture" 
    | "personality" 
    | "clothingStyle" 
    | "hairstyle"
    | "valuesMost" 
    | "providesForOthers" 
    | "personCaresMost" 
    | "objectCaresMost"
    | "familyBackground" 
    | "childhood" 
    | "familyCrisis" 
    | "lifeGoal"
    | "housing" 
    | "rent" 
    | "lifestyle" 
    | "description"
>;

type RelationKey = "friends" | "tragicLoveStories";

interface TextSection {
    title: string;
    className: string;
    clamp?: string;
    columns?: string;
    fields: {key: TextKey; label: string}[];
}

const HALF_WIDTH = "md:col-span-2 xl:col-span-2";

// Le sezioni di testo del mosaico: la card mostra l'anteprima, il modale tutto il contenuto
const TEXT_SECTIONS: TextSection[] = [
    {
        title: "Identità",
        className: HALF_WIDTH,
        fields: [
            {key: "originCulture", label: "Cultura di origine"},
            {key: "personality", label: "Personalità"},
            {key: "clothingStyle", label: "Stile di abbigliamento"},
            {key: "hairstyle", label: "Taglio di capelli"},
        ],
    },
    {
        title: "Valori e legami",
        className: HALF_WIDTH,
        fields: [
            {key: "valuesMost", label: "A cosa dai più valore?"},
            {key: "providesForOthers", label: "Cosa provi per gli altri?"},
            {key: "personCaresMost", label: "Persona a cui tieni di più"},
            {key: "objectCaresMost", label: "Oggetto a cui tieni di più"},
        ],
    },
    {
        title: "Passato",
        className: HALF_WIDTH,
        fields: [
            {key: "familyBackground", label: "Background familiare"},
            {key: "childhood", label: "La tua infanzia"},
            {key: "familyCrisis", label: "Crisi familiare"},
            {key: "lifeGoal", label: "Scopo nella vita"},
        ],
    },
    {
        title: "Info aggiuntive",
        className: HALF_WIDTH,
        fields: [
            {key: "housing", label: "Alloggio"},
            {key: "rent", label: "Affitto"},
            {key: "lifestyle", label: "Stile di vita"},
        ],
    },
    {
        title: "Descrizione del personaggio",
        className: "md:col-span-2 xl:col-span-4",
        clamp: "line-clamp-10",
        columns: "",
        fields: [{key: "description", label: "Descrizione"}],
    },
];

// Anteprima di una relazione: nome come titolo, legame a destra del nome, dettaglio sotto
const relationEntry = (relation: Relation): EntryItem => ({
    title: relation.name,
    meta: relation.bond,
    preview: relation.details,
});

// Una colonna per campo; sotto sm ogni riga diventa una card con le etichette
const ENEMY_COLUMNS = "minmax(0,1fr) minmax(0,1.3fr) minmax(0,1.3fr) minmax(0,1.3fr)";

type OpenEntry = {kind: RelationKey; index: number} | {kind: "enemy"; index: number} | null;

const BackgroundPanel = () => {
    const {sheet, update} = useSheet();
    const {background} = sheet;
    const [openEntry, setOpenEntry] = useState<OpenEntry>(null);

    const setRoleFields = (roleBackground: LabeledField[]) => update(
        (s) => ({...s, background: {...s.background, roleBackground}})
    );

    const addRelation = (kind: RelationKey) => {
        const list = background[kind];
        update((s) => ({...s, background: {...s.background, [kind]: [...list, {name: "", bond: "", details: ""}]}}));
        setOpenEntry({kind, index: list.length});
    };

    const addEnemy = () => {
        update((s) => ({
            ...s,
            background: {...s.background, enemies: [...s.background.enemies, {who: "", why: "", canTrigger: "", whatHappens: ""}]},
        }));

        setOpenEntry({kind: "enemy", index: background.enemies.length});
    };

    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DynamicFieldsSection 
                title="Background di ruolo" 
                fields={background.roleBackground} 
                onChange={setRoleFields}
                className="border-[3px] md:col-span-2 xl:col-span-4"
            />

            <Tile title="Amici" className="xl:col-span-2" action={<AddButton onClick={() => addRelation("friends")}/>}>
                <EntryList
                    entries={background.friends.map(relationEntry)}
                    onOpen={(index) => setOpenEntry({kind: "friends", index})}
                    emptyLabel="Nessun amico"
                />
            </Tile>

            <Tile title="Tragiche storie d'amore" className="xl:col-span-2"
                  action={<AddButton onClick={() => addRelation("tragicLoveStories")}/>}>
                <EntryList
                    entries={background.tragicLoveStories.map(relationEntry)}
                    onOpen={(index) => setOpenEntry({kind: "tragicLoveStories", index})}
                    emptyLabel="Nessuna storia"
                />
            </Tile>

            <Tile title="Nemici" className="md:col-span-2 xl:col-span-4" action={<AddButton onClick={addEnemy}/>}>
                <ClickableTable
                    rows={background.enemies}
                    onOpen={(index) => setOpenEntry({kind: "enemy", index})}
                    emptyLabel="Nessun nemico"
                    widths={ENEMY_COLUMNS}
                    columns={[
                        {header: "Chi?", className: "line-clamp-2", render: (enemy) => enemy.who || "—"},
                        {header: "Perché?", className: "line-clamp-2", render: (enemy) => enemy.why || "—"},
                        {header: "Cosa può scatenarti contro?", label: "Scatenarti contro", className: "line-clamp-2", render: (enemy) => enemy.canTrigger || "—"},
                        {header: "Cosa accadrà?", className: "line-clamp-2", render: (enemy) => enemy.whatHappens || "—"},
                    ]}
                />
            </Tile>

            {TEXT_SECTIONS.map((section) => (
                <FieldsSection
                    key={section.title}
                    title={section.title}
                    className={section.className}
                    columnsClassName={section.columns}
                    clampClassName={section.clamp}
                    fields={section.fields.map(({key, label}) => ({
                        label,
                        value: background[key],
                        onChange: (value) => update((s) => ({...s, background: {...s.background, [key]: value}})),
                    }))}
                />
            ))}

            {(openEntry?.kind === "friends" || openEntry?.kind === "tragicLoveStories") && (
                <RelationModal kind={openEntry.kind} index={openEntry.index} onClose={() => setOpenEntry(null)}/>
            )}

            {openEntry?.kind === "enemy" && background.enemies[openEntry.index] && (
                <EnemyModal index={openEntry.index} onClose={() => setOpenEntry(null)}/>
            )}
        </div>
    );
};
export default BackgroundPanel;

// Modale di amico o storia d'amore: nome, legame e dettaglio
const RelationModal = ({kind, index, onClose}: {kind: RelationKey; index: number; onClose: () => void}) => {
    const {sheet, update} = useSheet();
    const relation = sheet.background[kind][index];
    if (!relation) return null;

    const patch = (values: Partial<Relation>) => update((s) => ({
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
            footer={<DeleteButton label="Elimina" onClick={remove}/>}
        >
            <TextField 
                label="Nome" 
                value={relation.name} 
                onChange={(name) => patch({name})}
            />

            <TextField
                label="Legame"
                value={relation.bond}
                placeholder={isFriend ? "es. amico d'infanzia" : "es. ex partner"}
                onChange={(bond) => patch({bond})}
            />

            <TextField 
                label="Dettaglio" 
                value={relation.details} 
                multiline 
                onChange={(details) => patch({details})}
            />
        </Modal>
    );
};

const EnemyModal = ({index, onClose}: {index: number; onClose: () => void}) => {
    const {sheet, update} = useSheet();
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
            footer={<DeleteButton label="Elimina nemico" onClick={remove}/>}
        >
            <TextField 
                label="Chi?" 
                value={enemy.who} 
                onChange={(who) => patch({who})}
            />

            <TextField 
                label="Perché?" 
                value={enemy.why} 
                multiline 
                onChange={(why) => patch({why})}
            />

            <TextField 
                label="Cosa può scatenarti contro?" 
                value={enemy.canTrigger} 
                multiline 
                onChange={(canTrigger) => patch({canTrigger})}
            />

            <TextField 
                label="Cosa accadrà?" 
                value={enemy.whatHappens} 
                multiline 
                onChange={(whatHappens) => patch({whatHappens})}
            />
        </Modal>
    );
};
