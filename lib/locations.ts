import { City, State } from 'country-state-city';

export const US_STATES = State.getStatesOfCountry('US').map((state)=> ({
  label: `${state.name} (${state.isoCode})`,
  value: state.isoCode,
}));

export const DEFAULT_STATE = 'ME';

export function getCitiesForState(stateCode: string){
  return City.getCitiesOfState('US', stateCode)
    .map((city)=> city.name)
    .sort((a, b)=> a.localeCompare(b));
}
