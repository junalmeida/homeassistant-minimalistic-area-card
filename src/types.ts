import { ActionConfig, EntityConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'minimalistic-area-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export interface MinimalisticAreaCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  image?: string;
  area?: string;
  camera_image?: string;
  camera_view?: "auto" | "live";
  background_color?: string;
  hide_unavailable?: boolean;
  entities?: Array<EntityConfig | string>;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface HomeAssistantArea {
  area_id: string,
  picture: string,
  name: string
}

export const cardType = "minimalistic-area-card";