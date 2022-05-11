import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'minimalistic-area-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface MinimalisticAreaCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  image?: string;
  entities?: Array<EntityConfig>;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface EntityConfig {
  entity: string;
}