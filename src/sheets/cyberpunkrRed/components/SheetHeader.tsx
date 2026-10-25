import {UserRound} from "lucide-react";
import DetailField from "../../../components/common/DetailField";
import {NumberField, TextField} from "../../../components/common/EditableField";
import {inputClass, panelTitleClass, sectionClass} from "../../../components/common/ui";
import {STAT_LABELS, type CharacterInfo, type Health, type StatKey} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";

const STAT_KEYS = Object.keys(STAT_LABELS) as StatKey[];

// Riepilogo a quattro colonne:
// a sinistra reputazione sopra e ritratto sotto; accanto anagrafica sopra e note sotto;
// a destra statistiche e salute su tutta l'altezza
const SheetHeader = () => {
    const {sheet, editMode, update} = useSheet();
    const {character, health, stats} = sheet;

    const patchCharacter = (patch: Partial<CharacterInfo>) =>
        update((s) => ({...s, character: {...s.character, ...patch}}));

    const patchHealth = (patch: Partial<Health>) =>
        update((s) => ({...s, health: {...s.health, ...patch}}));

    const hpPercent = health.maxHitPoints > 0
        ? Math.min(100, Math.max(0, (health.currentHitPoints / health.maxHitPoints) * 100))
        : 0;

    return (
        <header className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] xl:grid-rows-[auto_auto] xl:items-stretch">
            <section className={`${sectionClass} xl:col-start-1 xl:row-start-2`} aria-label="Reputazione">
                <h2 className={panelTitleClass}>Reputazione</h2>
                <NumberField label="Reputazione" value={character.reputation.points} editMode={editMode}
                             onChange={(points) => patchCharacter({reputation: {...character.reputation, points}})}/>
                <DetailField label="Motivi della reputazione" value={character.reputation.reasons} editMode={editMode}
                           onChange={(reasons) => patchCharacter({reputation: {...character.reputation, reasons}})}/>
            </section>

            {/* Ritratto grande quanto la colonna, sopra la reputazione */}
            <figure className="m-0 grid content-start gap-3 xl:col-start-1 xl:row-start-1">
                <div className="grid aspect-square w-4/5 justify-self-center place-items-center overflow-hidden border border-cpr-red/50 bg-cpr-panel">
                    {character.portraitUrl ? (
                        <img
                            src={character.portraitUrl}
                            alt={character.tag ? `Ritratto di ${character.tag}` : "Ritratto del personaggio"}
                            className="size-full object-cover"
                        />
                    ) : (
                        <div className="grid place-items-center content-center gap-2 p-4 text-center opacity-70">
                            <UserRound size={64} aria-hidden="true" className="justify-self-center text-cpr-red"/>
                            <span className="text-sm font-bold tracking-widest uppercase">Ritratto</span>
                        </div>
                    )}
                </div>

                {editMode && (
                    <TextField label="URL ritratto" value={character.portraitUrl} editMode
                               placeholder="https://..." onChange={(portraitUrl) => patchCharacter({portraitUrl})}/>
                )}
            </figure>

            <section className={`${sectionClass} xl:col-start-2 xl:row-start-1`} aria-label="Anagrafica">
                <h2 className={panelTitleClass}>Anagrafica</h2>

                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Nome personaggio" value={character.tag} editMode={editMode}
                               onChange={(tag) => patchCharacter({tag})}/>
                    <TextField label="Nome giocatore" value={character.playerName} editMode={editMode}
                               onChange={(playerName) => patchCharacter({playerName})}/>
                    <TextField label="Alias" value={character.alias} editMode={editMode}
                               onChange={(alias) => patchCharacter({alias})}/>
                    <TextField label="Ruolo" value={character.role} editMode={editMode}
                               onChange={(role) => patchCharacter({role})}/>
                    <TextField label="Capacità di ruolo" value={character.roleAbility.name} editMode={editMode}
                               onChange={(name) => patchCharacter({roleAbility: {...character.roleAbility, name}})}/>
                    <NumberField label="Rango capacità" value={character.roleAbility.rank} editMode={editMode}
                                 onChange={(rank) => patchCharacter({roleAbility: {...character.roleAbility, rank}})}/>
                    <NumberField label="Punti miglioramento" value={character.improvementPoints} editMode={editMode}
                                 onChange={(improvementPoints) => patchCharacter({improvementPoints})}/>
                </div>
            </section>

            <section className={`${sectionClass} xl:col-start-2 xl:row-start-2`} aria-label="Note">
                <h2 className={panelTitleClass}>Note</h2>
                <DetailField label="Note" value={character.notes} editMode={editMode}
                           onChange={(notes) => patchCharacter({notes})}/>
            </section>

            <section
                aria-label="Statistiche"
                className="group-data-[editing=true]/sheet:border-dashed grid grid-cols-2 grid-rows-5 gap-2 border-2 border-cpr-red bg-cpr-panel p-3.5 xl:col-start-3 xl:row-span-2 xl:row-start-1"
            >
                {STAT_KEYS.map((key) => (
                    <div key={key} className="grid min-h-0 content-center gap-1 border border-cpr-red/35 px-2 py-3 text-center">
                        <span className="text-[0.75em] font-extrabold tracking-widest text-cpr-red">{STAT_LABELS[key]}</span>
                        {editMode ? (
                            <input
                                className={`${inputClass} min-h-11 text-center font-mono text-[1.4rem]`}
                                type="number"
                                inputMode="numeric"
                                aria-label={STAT_LABELS[key]}
                                value={stats[key]}
                                onChange={(event) => {
                                    const value = Number(event.target.value) || 0;
                                    update((s) => ({...s, stats: {...s.stats, [key]: value}}));
                                }}
                            />
                        ) : (
                            <strong className="font-mono text-[2rem] leading-none font-bold max-sm:text-[1.5rem]">{stats[key]}</strong>
                        )}
                    </div>
                ))}
            </section>

            <section className={`${sectionClass} xl:col-start-4 xl:row-span-2 xl:row-start-1`} aria-label="Salute">
                <h2 className={panelTitleClass}>Salute</h2>

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

                <div className="grid gap-3 sm:grid-cols-2">
                    <NumberField label="PF attuali" value={health.currentHitPoints} editMode={editMode}
                                 onChange={(currentHitPoints) => patchHealth({currentHitPoints})}/>
                    <NumberField label="PF massimi" value={health.maxHitPoints} editMode={editMode}
                                 onChange={(maxHitPoints) => patchHealth({maxHitPoints})}/>
                    <NumberField label="Ferito gravemente" value={health.seriouslyWounded} editMode={editMode}
                                 onChange={(seriouslyWounded) => patchHealth({seriouslyWounded})}/>
                    <NumberField label="Tiro della morte" value={health.deathSave} editMode={editMode}
                                 onChange={(deathSave) => patchHealth({deathSave})}/>
                    <NumberField label="Umanità" value={health.currentHumanity} editMode={editMode}
                                 onChange={(currentHumanity) => patchHealth({currentHumanity})}/>
                    <NumberField label="Umanità massima" value={health.maxHumanity} editMode={editMode}
                                 onChange={(maxHumanity) => patchHealth({maxHumanity})}/>
                </div>

                <TextField label="Ferite critiche" value={health.criticalInjuries} multiline editMode={editMode}
                           onChange={(criticalInjuries) => patchHealth({criticalInjuries})}/>
                <TextField label="Dipendenze" value={health.dependencies} multiline editMode={editMode}
                           onChange={(dependencies) => patchHealth({dependencies})}/>
            </section>
        </header>
    );
};
export default SheetHeader;
