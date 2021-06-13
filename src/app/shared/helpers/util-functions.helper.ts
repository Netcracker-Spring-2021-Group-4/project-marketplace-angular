import {validate as uuidValidate} from 'uuid';

export const isValidUUID = (uuid: string): boolean => {
  return uuidValidate(uuid);
}
