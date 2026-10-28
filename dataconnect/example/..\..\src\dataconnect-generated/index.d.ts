import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Character_Key {
  id: UUIDString;
  __typename?: 'Character_Key';
}

export interface CreateCharacterData {
  character_insert: Character_Key;
}

export interface CreateCharacterVariables {
  name: string;
  role?: string | null;
}

export interface ListCharactersData {
  characters: ({
    id: UUIDString;
    name: string;
    role?: string | null;
  } & Character_Key)[];
}

interface ListCharactersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCharactersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCharactersData, undefined>;
  operationName: string;
}
export const listCharactersRef: ListCharactersRef;

export function listCharacters(options?: ExecuteQueryOptions): QueryPromise<ListCharactersData, undefined>;
export function listCharacters(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCharactersData, undefined>;

interface CreateCharacterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCharacterVariables): MutationRef<CreateCharacterData, CreateCharacterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCharacterVariables): MutationRef<CreateCharacterData, CreateCharacterVariables>;
  operationName: string;
}
export const createCharacterRef: CreateCharacterRef;

export function createCharacter(vars: CreateCharacterVariables): MutationPromise<CreateCharacterData, CreateCharacterVariables>;
export function createCharacter(dc: DataConnect, vars: CreateCharacterVariables): MutationPromise<CreateCharacterData, CreateCharacterVariables>;

