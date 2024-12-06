export type BadgeColor =
  | 'green'
  | 'ruby'
  | 'tomato'
  | 'gold'
  | 'bronze'
  | 'amber'
  | 'orange'
  | 'brown'
  | 'pink'
  | 'crimson'
  | 'purple'
  | 'plum'
  | 'iris'
  | 'violet'
  | 'yellow'
  | 'red'
  | 'teal'
  | 'grass'
  | 'sky'
  | 'mint'
  | 'lime';

export interface BadgeData {
  color: BadgeColor;
  label: string;
}
