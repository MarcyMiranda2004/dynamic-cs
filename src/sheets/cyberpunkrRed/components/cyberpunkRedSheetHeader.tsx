import {useState} from "react";
import {UserRoundIcon} from "lucide-react";
import DetailField from "@/components/common/DetailField";
import {ClickNumber, InlineNumberField, InlineTextField} from "@/components/common/InlineEdit";
import Modal from "@/components/common/Modal";
import PanelHeading from "@/components/common/PanelHeading";
import {EditButton} from "@/components/common/SectionButtons";
import {NumberField, TextField} from "@/components/common/EditableField";
import {STAT_LABELS, type CharacterInfo, type Health, type StatKey} from "@/sheets/cyberpunkrRed/utils/CyberpunkRedCharacterSheetSchema";
import {useSheet} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedSheetContext";

const STAT_KEYS = Object.keys(STAT_LABELS) as StatKey[];

type HeaderModal = "portrait" | "reputation" | "identity" | "notes" | "stats" | "health";

const SheetHeader = () => {
    const {sheet, update} = useSheet();
    const {character, health, stats} = sheet;
    const [open, setOpen] = useState<HeaderModal | null>(null);

    const patchCharacter = (patch: Partial<CharacterInfo>) => update(
        (s) => ({...s, character: {...s.character, ...patch}})
    );

    const patchHealth = (patch: Partial<Health>) => update(
        (s) => ({...s, health: {...s.health, ...patch}})
    );

    const hpPercent = health.maxHitPoints > 0
        ? Math.min(100, Math.max(0, (health.currentHitPoints / health.maxHitPoints) * 100))
        : 0;

    return (
        <header className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] xl:grid-rows-[auto_auto] xl:items-stretch">
            {/* Ritratto in cima e reputazione sotto, nella stessa colonna: niente vuoto tra le due card */}
            <div className="grid content-start gap-3 xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:grid-rows-[minmax(0,1fr)_auto]">
                <button
                    type="button"
                    onClick={() => setOpen("portrait")}
                    aria-label="Ritratto: apri e modifica"
                    className="relative grid aspect-4/3 w-full cursor-pointer place-items-center overflow-hidden border border-cpr-red/50 bg-cpr-panel p-0 text-inherit xl:aspect-auto xl:min-h-64 hover:border-cpr-glow focus-visible:border-cpr-glow focus-visible:outline-none"
                >
                    {character.portraitUrl ? (
                        <img
                            src={character.portraitUrl}
                            alt={character.tag ? `Ritratto di ${character.tag}` : "Ritratto del personaggio"}
                            className="absolute inset-0 size-full object-cover object-top"
                        />
                    ) : (
                        <span className="grid place-items-center content-center gap-2 p-4 text-center opacity-70">
                            <UserRoundIcon size={48} aria-hidden="true" className="justify-self-center text-cpr-red"/>
                            <span className="text-sm font-bold tracking-widest uppercase">Ritratto</span>
                        </span>
                    )}
                </button>

                <section className="sectionClass" aria-label="Reputazione">
                    <PanelHeading level="h2" title="Reputazione" action={<EditButton onClick={() => setOpen("reputation")}/>}/>
                    <InlineNumberField
                        label="Reputazione"
                        value={character.reputation.points}
                        onChange={(points) => patchCharacter({reputation: {...character.reputation, points}})}
                    />

                    <DetailField
                        label="Motivi della reputazione"
                        value={character.reputation.reasons}
                        onChange={(reasons) => patchCharacter({reputation: {...character.reputation, reasons}})}
                    />
                </section>
            </div>

            <section className="sectionClass xl:col-start-2 xl:row-start-1" aria-label="Anagrafica">
                <PanelHeading level="h2" title="Anagrafica" action={<EditButton onClick={() => setOpen("identity")}/>}/>

                <div className="grid grid-cols-2 gap-2">
                    <InlineTextField
                        label="Nome personaggio"
                        value={character.tag}
                        onChange={(tag) => patchCharacter({tag})}
                    />

                    <InlineTextField
                        label="Nome giocatore"
                        value={character.playerName}
                        onChange={(playerName) => patchCharacter({playerName})}
                    />

                    <InlineTextField
                        label="Alias"
                        value={character.alias}
                        onChange={(alias) => patchCharacter({alias})}
                    />

                    <InlineTextField
                        label="Ruolo"
                        value={character.role}
                        onChange={(role) => patchCharacter({role})}
                    />

                    <InlineTextField
                        label="Capacità di ruolo"
                        value={character.roleAbility.name}
                        onChange={(name) => patchCharacter({roleAbility: {...character.roleAbility, name}})}
                    />

                    <InlineNumberField
                        label="Rango capacità"
                        value={character.roleAbility.rank}
                        onChange={(rank) => patchCharacter({roleAbility: {...character.roleAbility, rank}})}
                    />

                    <InlineNumberField
                        label="Punti miglioramento"
                        value={character.improvementPoints}
                        onChange={(improvementPoints) => patchCharacter({improvementPoints})}
                    />
                </div>
            </section>

            <section className="sectionClass xl:col-start-2 xl:row-start-2" aria-label="Note">
                <PanelHeading level="h2" title="Note" action={<EditButton onClick={() => setOpen("notes")}/>}/>
                <DetailField
                    label="Note"
                    value={character.notes}
                    onChange={(notes) => patchCharacter({notes})}
                />
            </section>

            <section
                aria-label="Statistiche"
                className="sectionClass grid-rows-[auto_1fr] xl:col-start-3 xl:row-span-2 xl:row-start-1"
            >
                <PanelHeading level="h2" title="Statistiche" action={<EditButton onClick={() => setOpen("stats")}/>}/>
                <div className="grid grid-cols-5 gap-1.5 md:grid-cols-2 md:grid-rows-5">
                    {STAT_KEYS.map((key) => (
                        <div key={key} className="grid min-h-0 content-center gap-0.5 border border-cpr-red/35 px-2 py-2 text-center">
                            <span className="text-[0.75em] font-extrabold tracking-widest text-cpr-red">{STAT_LABELS[key]}</span>
                            <ClickNumber
                                ariaLabel={STAT_LABELS[key]}
                                value={stats[key]}
                                centered
                                className="font-mono text-[1.6rem] leading-none font-bold max-sm:text-[1.3rem]"
                                onChange={(value) => update((s) => ({...s, stats: {...s.stats, [key]: value}}))}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="sectionClass xl:col-start-4 xl:row-span-2 xl:row-start-1" aria-label="Salute">
                <PanelHeading level="h2" title="Salute" action={<EditButton onClick={() => setOpen("health")}/>}/>

                <div
                    role="meter"
                    aria-label="Punti ferita"
                    aria-valuemin={0}
                    aria-valuemax={health.maxHitPoints}
                    aria-valuenow={health.currentHitPoints}
                    className="relative h-3.5 overflow-hidden border border-cpr-red"
                >
                    <span
                        className="block h-full bg-linear-to-r from-cpr-red-deep to-cpr-red shadow-[0_0_10px_var(--color-cpr-red)] transition-[width] duration-400 motion-reduce:transition-none"
                        style={{width: `${hpPercent}%`}}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InlineNumberField
                        label="PF attuali"
                        value={health.currentHitPoints}
                        onChange={(currentHitPoints) => patchHealth({currentHitPoints})}
                    />

                    <InlineNumberField
                        label="PF massimi"
                        value={health.maxHitPoints}
                        onChange={(maxHitPoints) => patchHealth({maxHitPoints})}
                    />

                    <InlineNumberField
                        label="Ferito gravemente"
                        value={health.seriouslyWounded}
                        onChange={(seriouslyWounded) => patchHealth({seriouslyWounded})}
                    />

                    <InlineNumberField
                        label="Tiro della morte"
                        value={health.deathSave}
                        onChange={(deathSave) => patchHealth({deathSave})}
                    />

                    <InlineNumberField
                        label="Umanità"
                        value={health.currentHumanity}
                        onChange={(currentHumanity) => patchHealth({currentHumanity})}
                    />

                    <InlineNumberField
                        label="Umanità massima"
                        value={health.maxHumanity}
                        onChange={(maxHumanity) => patchHealth({maxHumanity})}
                    />
                </div>

                <div className="space-y-2">
                    <DetailField
                        label="Ferite critiche"
                        value={health.criticalInjuries}
                        onChange={(criticalInjuries) => patchHealth({criticalInjuries})}
                    />

                    <DetailField
                        label="Dipendenze"
                        value={health.dependencies}
                        onChange={(dependencies) => patchHealth({dependencies})}
                    />
                </div>
            </section>

            {open && <HeaderModalView kind={open} onClose={() => setOpen(null)}/>}
        </header>
    );
};
export default SheetHeader;

// Modale di una sezione del riepilogo: i campi leggono e scrivono direttamente la scheda
const HeaderModalView = ({kind, onClose}: {kind: HeaderModal; onClose: () => void}) => {
    const {sheet, update} = useSheet();
    const {character, health, stats} = sheet;

    const patchCharacter = (patch: Partial<CharacterInfo>) => update(
        (s) => ({...s, character: {...s.character, ...patch}})
    );

    const patchHealth = (patch: Partial<Health>) => update(
        (s) => ({...s, health: {...s.health, ...patch}})
    );

    switch (kind) {
        case "portrait":
            return (
                <Modal title="Ritratto" onClose={onClose}>
                    {character.portraitUrl && (
                        <img
                            src={character.portraitUrl}
                            alt="Anteprima del ritratto"
                            className="max-h-72 w-full border border-ui-overlay-line object-cover object-top"
                        />
                    )}

                    <TextField
                        label="URL ritratto"
                        value={character.portraitUrl}
                        placeholder="https://..."
                        onChange={(portraitUrl) => patchCharacter({portraitUrl})}
                    />
                </Modal>
            );

        case "reputation":
            return (
                <Modal title="Reputazione" onClose={onClose}>
                    <NumberField
                        label="Reputazione"
                        value={character.reputation.points}
                        onChange={(points) => patchCharacter({reputation: {...character.reputation, points}})}
                    />

                    <TextField
                        label="Motivi della reputazione"
                        value={character.reputation.reasons}
                        multiline
                        onChange={(reasons) => patchCharacter({reputation: {...character.reputation, reasons}})}
                    />
                </Modal>
            );

        case "identity":
            return (
                <Modal title="Anagrafica" wide onClose={onClose}>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField
                            label="Nome personaggio"
                            value={character.tag}
                            onChange={(tag) => patchCharacter({tag})}
                        />

                        <TextField
                            label="Nome giocatore"
                            value={character.playerName}
                            onChange={(playerName) => patchCharacter({playerName})}
                        />

                        <TextField
                            label="Alias"
                            value={character.alias}
                            onChange={(alias) => patchCharacter({alias})}
                        />

                        <TextField
                            label="Ruolo"
                            value={character.role}
                            onChange={(role) => patchCharacter({role})}
                        />

                        <TextField
                            label="Capacità di ruolo"
                            value={character.roleAbility.name}
                            onChange={(name) => patchCharacter({roleAbility: {...character.roleAbility, name}})}
                        />

                        <NumberField
                            label="Rango capacità"
                            value={character.roleAbility.rank}
                            onChange={(rank) => patchCharacter({roleAbility: {...character.roleAbility, rank}})}
                        />

                        <NumberField
                            label="Punti miglioramento"
                            value={character.improvementPoints}
                            onChange={(improvementPoints) => patchCharacter({improvementPoints})}
                        />
                    </div>
                </Modal>
            );

        case "notes":
            return (
                <Modal title="Note" onClose={onClose}>
                    <TextField
                        label="Note"
                        value={character.notes}
                        multiline
                        onChange={(notes) => patchCharacter({notes})}
                    />
                </Modal>
            );

        case "stats":
            return (
                <Modal title="Statistiche" onClose={onClose}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {STAT_KEYS.map((key) => (
                            <NumberField
                                key={key}
                                label={STAT_LABELS[key]}
                                value={stats[key]}
                                onChange={(value) => update((s) => ({...s, stats: {...s.stats, [key]: value}}))}
                            />
                        ))}
                    </div>
                </Modal>
            );

        case "health":
            return (
                <Modal title="Salute" wide onClose={onClose}>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <NumberField
                            label="PF attuali"
                            value={health.currentHitPoints}
                            onChange={(currentHitPoints) => patchHealth({currentHitPoints})}
                        />

                        <NumberField
                            label="PF massimi"
                            value={health.maxHitPoints}
                            onChange={(maxHitPoints) => patchHealth({maxHitPoints})}
                        />

                        <NumberField
                            label="Ferito gravemente"
                            value={health.seriouslyWounded}
                            onChange={(seriouslyWounded) => patchHealth({seriouslyWounded})}
                        />

                        <NumberField
                            label="Tiro della morte"
                            value={health.deathSave}
                            onChange={(deathSave) => patchHealth({deathSave})}
                        />

                        <NumberField
                            label="Umanità"
                            value={health.currentHumanity}
                            onChange={(currentHumanity) => patchHealth({currentHumanity})}
                        />

                        <NumberField
                            label="Umanità massima"
                            value={health.maxHumanity}
                            onChange={(maxHumanity) => patchHealth({maxHumanity})}
                        />

                        <TextField
                            label="Ferite critiche"
                            value={health.criticalInjuries}
                            multiline
                            onChange={(criticalInjuries) => patchHealth({criticalInjuries})}
                        />

                        <TextField
                            label="Dipendenze"
                            value={health.dependencies}
                            multiline
                            onChange={(dependencies) => patchHealth({dependencies})}
                        />
                    </div>
                </Modal>
            );
    }
};
