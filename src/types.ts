import { ActionConfig, EntityConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor, STATES_OFF as STATES_OFF_HELPER } from 'custom-card-helpers';
import { name } from "../package.json";
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
  shadow?: boolean;
}

export interface HomeAssistantArea {
  area_id: string,
  picture: string,
  name: string
}

export const UNAVAILABLE = "unavailable";
export const STATES_OFF = [...STATES_OFF_HELPER, UNAVAILABLE, "idle"
  , "disconnected"];
export const cardType = name;