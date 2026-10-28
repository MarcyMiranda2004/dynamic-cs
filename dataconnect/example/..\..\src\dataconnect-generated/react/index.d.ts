import { ListCharactersData, CreateCharacterData, CreateCharacterVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListCharacters(options?: useDataConnectQueryOptions<ListCharactersData>): UseDataConnectQueryResult<ListCharactersData, undefined>;
export function useListCharacters(dc: DataConnect, options?: useDataConnectQueryOptions<ListCharactersData>): UseDataConnectQueryResult<ListCharactersData, undefined>;

export function useCreateCharacter(options?: useDataConnectMutationOptions<CreateCharacterData, FirebaseError, CreateCharacterVariables>): UseDataConnectMutationResult<CreateCharacterData, CreateCharacterVariables>;
export function useCreateCharacter(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCharacterData, FirebaseError, CreateCharacterVariables>): UseDataConnectMutationResult<CreateCharacterData, CreateCharacterVariables>;
