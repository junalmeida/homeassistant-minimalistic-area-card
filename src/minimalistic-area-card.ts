/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ActionHandlerEvent,
    EntityConfig,
    handleAction, hasAction, hasConfigOrEntityChanged, HomeAssistant, NavigateActionConfig
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { ifDefined } from "lit/directives/if-defined";
import { actionHandler } from './action-handler-directive';
import { findEntities } from './find-entities';
import { cardType, HomeAssistantArea, MinimalisticAreaCardConfig } from './types';

import { version as pkgVersion } from "../package.json";

/* eslint no-console: 0 */
console.info(
    `%c  Minimalistic Area Card  %c ${pkgVersion} `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
);

const STATE_NOT_RUNNING = "NOT_RUNNING";
const SENSORS = [
    "sensor",
    "binary_sensor"
];
const STATES_OFF = ["closed", "locked", "off"];
const DOMAINS_TOGGLE = [
    "fan",
    "input_boolean",
    "light",
    "switch",
    "group",
    "automation",
    "humidifier",
];


const createEntityNotFoundWarning = (
    hass,
    entityId
) =>
    hass.config.state !== STATE_NOT_RUNNING
        ? hass.localize(
            "ui.panel.lovelace.warning.entity_not_found",
            "entity",
            entityId || "[empty]"
        )
        : hass.localize("ui.panel.lovelace.warning.starting");

type HomeAssistantExt = HomeAssistant & {
    areas: { [key: string]: HomeAssistantArea },
    entities: { [key: string]: { area_id?: string, entity_id: string, device_id?: string, entity_category?: string, disabled_by?: string } }
    devices: { [key: string]: { area_id?: string, disabled_by?: string } }
};
class MinimalisticAreaCard extends LitElement {
    static properties = {
        hass: { attribute: false },
        config: { state: true }
    };

    private hass!: HomeAssistantExt;
    private config!: MinimalisticAreaCardConfig;
    private area?: HomeAssistantArea;
    private areaEntities?: string[];

    override async performUpdate() {
        this.setArea();
        this.setEntities();
        await super.performUpdate();
    }

    setArea() {
        if (this.hass?.connected) {
            if (this.config && this.config.area) {
                const area = this.hass.areas[this.config.area];
                if (area) {
                    this.area = area;
                    this.areaEntities = MinimalisticAreaCard.findAreaEntities(this.hass, area.area_id);
                }
                else {
                    this.area = undefined;
                    this.areaEntities = undefined;
                }
            }
            else {
                this.area = undefined;
                this.areaEntities = undefined;
            }
        }
        else {
            console.error("Invalid hass connection");
        }
    }

    _entitiesDialog: Array<EntityConfig> = [];
    _entitiesToggle: Array<EntityConfig> = [];
    _entitiesSensor: Array<EntityConfig> = [];

    setEntities() {
        this._entitiesDialog = [];
        this._entitiesToggle = [];
        this._entitiesSensor = [];

        const entities = this.config?.entities || this.areaEntities || [];

        entities.forEach((item) => {

            const entity = this.parseEntity(item);
            const [domain, _] = entity.entity.split('.');
            if (SENSORS.indexOf(domain) !== -1) {
                this._entitiesSensor.push(entity);
            }
            else if (
                this.config?.force_dialog ||
                DOMAINS_TOGGLE.indexOf(domain) === -1
            ) {
                this._entitiesDialog.push(entity);
            } else {
                this._entitiesToggle.push(entity);
            }
        });
    }

    parseEntity(item: EntityConfig | string) {
        if (typeof item === "string")
            return {
                entity: item
            } as EntityConfig;
        else
            return item;
    }

    _handleEntityAction(ev: ActionHandlerEvent) {
        const config = (ev.currentTarget as any).config;
        handleAction(this, this.hass, config, ev.detail.action);
    }

    _handleThisAction(ev: ActionHandlerEvent) {
        const parent = ((ev.currentTarget as HTMLElement).getRootNode() as any)?.host?.parentElement as HTMLElement;
        if (this.hass && this.config && ev.detail.action && (!parent || parent.tagName !== "HUI-CARD-PREVIEW")) {
            handleAction(this, this.hass, this.config, ev.detail.action);
        }
    }
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config: MinimalisticAreaCardConfig) {

        if (
            !config ||
            (config.entities &&
                !Array.isArray(config.entities))
        ) {
            throw new Error("Invalid configuration");
        }

        this.config = {
            hold_action: { action: "more-info" },
            ...config,
        };
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return 3;
    }

    render() {
        if (!this.config || !this.hass) {
            return html``;
        }
        const color = this.config.background_color ? `background-color: ${this.config.background_color}` : "";
        let imageUrl: string | undefined = undefined;
        if (!this.config.camera_image && (this.config.image || this.area?.picture)) {
            imageUrl = (new URL(this.config.image || this.area?.picture || "", this.hass.auth.data.hassUrl)).toString();
        }


        return html`
        <ha-card @action=${this._handleThisAction} style=${color}
            .actionHandler=${actionHandler({
            hasHold: hasAction(this.config.hold_action),
            hasDoubleClick: hasAction(this.config.double_tap_action),
        })}
            tabindex=${ifDefined(
            hasAction(this.config.tap_action) ? "0" : undefined
        )}>
    ${imageUrl ? html`<img src=${imageUrl} />` : null}
    ${this.config.camera_image ? html`<div class="camera"><hui-image
            .hass=${this.hass}
            .cameraImage=${this.config.camera_image}
            .entity=${this.config.camera_image}
            .cameraView=${this.config.camera_view || "auto"}
            .width="100%"
          ></hui-image></div>` : null}

    <div class="box">
        <div class="card-header"
            >${this.config.title}</div>
        <div class="sensors">
            ${this._entitiesSensor.map((entityConf) =>
            this.renderEntity(entityConf, true, true)
        )}
        </div>
        <div class="buttons">
            ${this._entitiesDialog.map((entityConf) =>
            this.renderEntity(entityConf, true, false)
        )}
            ${this._entitiesToggle.map((entityConf) =>
            this.renderEntity(entityConf, false, false)
        )}
        </div>
    </div>
</ha-card>
    `;
    }

    renderEntity(
        entityConf: EntityConfig,
        dialog: boolean,
        isSensor: boolean
    ) {
        const stateObj = this.hass.states[entityConf.entity];


        entityConf = {
            tap_action: { action: dialog ? "more-info" : "toggle" },
            hold_action: { action: "more-info" },
            show_state: entityConf.show_state === undefined ? true : !!entityConf.show_state,
            ...entityConf,
        };

        if (!stateObj && !this.config.hide_unavailable) {
            return html`
            <div class="wrapper">
                <hui-warning-element .label=${createEntityNotFoundWarning(this.hass, entityConf.entity)}></hui-warning-element>
            </div>
      `;
        }
        else if (!stateObj && this.config.hide_unavailable) {
            return html``;
        }


        return html`
    <div class="wrapper">
        <ha-icon-button @action=${this._handleEntityAction} .actionHandler=${actionHandler({
            hasHold:
                hasAction(entityConf.hold_action), hasDoubleClick: hasAction(entityConf.double_tap_action),
        })}
            .config=${entityConf} class=${classMap({
            "state-on": stateObj.state && [...STATES_OFF, "unavailable", "idle"
                , "disconnected"].indexOf(stateObj.state.toString().toLowerCase()) === -1,
        })}>
            <ha-state-icon .icon=${entityConf.icon} .state=${stateObj}></ha-state-icon>
        </ha-icon-button>
        ${isSensor && entityConf.show_state ? html`
        <div class="state">
            ${entityConf.attribute
                    ? html`
            ${entityConf.prefix}${stateObj.attributes[
                        entityConf.attribute
                        ]}${entityConf.suffix}
            `
                    : this.computeStateValue(stateObj)}
        </div>
        ` : null}
    </div>
    `;
    }

    isNumericState(stateObj) {
        return !!stateObj.attributes.unit_of_measurement ||
            !!stateObj.attributes.state_class;
    }

    computeStateValue(stateObj) {
        const [domain, _] = stateObj.entity_id.split(".");
        if (this.isNumericState(stateObj)) {
            const value = Number(stateObj.state);
            if (isNaN(value))
                return null;
            else
                return `${value}${stateObj.attributes.unit_of_measurement
                    ? " " + stateObj.attributes.unit_of_measurement
                    : ""}`;
        }
        else if (domain !== "binary_sensor" && stateObj.state !== "unavailable" && stateObj.state !== "idle") {
            return stateObj.state;
        }
        else {
            return null;
        }
    }

    shouldUpdate(changedProps) {
        if (hasConfigOrEntityChanged(this, changedProps, false)) {
            return true;
        }

        const oldHass = changedProps.get("hass");

        if (
            !oldHass ||
            oldHass.themes !== this.hass.themes ||
            oldHass.locale !== this.hass.locale
        ) {
            return true;
        }

        for (const entity of [...this._entitiesDialog, ...this._entitiesToggle, ...this._entitiesSensor]) {
            if (
                oldHass.states[entity.entity] !== this.hass.states[entity.entity]
            ) {
                return true;
            }
        }

        return false;
    }

    static findAreaEntities(hass: HomeAssistantExt, area_id: string) {
        const area = hass.areas && hass.areas[area_id];
        const areaEntities = hass.entities && area &&
            Object.keys(hass.entities)
                .filter((e) =>
                    !hass.entities[e].disabled_by &&
                    hass.entities[e].entity_category !== "diagnostic" &&
                    hass.entities[e].entity_category !== "config" && (
                        hass.entities[e].area_id === area.area_id ||
                        hass.devices[hass.entities[e].device_id || ""]?.area_id === area.area_id
                    )
                )
                .map((x) => x);
        return areaEntities;
    }

    static getStubConfig(hass: HomeAssistantExt,
        entities: string[],
        entitiesFallback: string[]) {

        const area = hass.areas && hass.areas[Object.keys(hass.areas)[0]];
        const areaEntities = MinimalisticAreaCard.findAreaEntities(hass, area.area_id);

        const lights = findEntities(
            hass,
            2,
            areaEntities?.length ? areaEntities : entities,
            entitiesFallback,
            ["light"]
        );
        const switches = findEntities(
            hass,
            2,
            areaEntities?.length ? areaEntities : entities,
            entitiesFallback,
            ["switch"]
        );

        const sensors = findEntities(
            hass,
            2,
            areaEntities?.length ? areaEntities : entities,
            entitiesFallback,
            ["sensor"]
        );
        const binary_sensors = findEntities(
            hass,
            2,
            areaEntities?.length ? areaEntities : entities,
            entitiesFallback,
            ["binary_sensor"]
        );

        const obj = {
            title: "Kitchen",
            image: "https://demo.home-assistant.io/stub_config/kitchen.png",
            area: "",
            hide_unavailable: false,
            tap_action: {
                action: "navigate",
                navigation_path: "/lovelace-kitchen"
            },
            entities: [...lights, ...switches, ...sensors, ...binary_sensors],
        } as MinimalisticAreaCardConfig;
        if (area) {
            obj.area = area.area_id;
            obj.title = area.name;
            (obj.tap_action as NavigateActionConfig).navigation_path = "/config/areas/area/" + area.area_id;
            delete obj.image;
        }
        else {
            delete obj.area;
        }
        return obj;
    }

    static get styles() {
        return css`
      * {
        box-sizing: border-box;
      }
      ha-card {
        position: relative;
        min-height: 48px;
        height: 100%;
        z-index: 0;
      }

      img {
          display: block;
          height: 100%;
          width: 100%;

          filter: brightness(0.55);
          object-fit: cover;

          position: absolute;
          z-index: -1;
          pointer-events: none;
          border-radius: var(--ha-card-border-radius)
      }

      div.camera {
          height: 100%;
          width: 100%;
          overflow: hidden;
         
          position: absolute; 
          left: 0; top: 0; 
          
          z-index: -1;
          pointer-events: none;
          border-radius: var(--ha-card-border-radius);
      }

      div.camera hui-image {
          position: relative; 
          top: 50%;
          transform: translateY(-50%);
      }

      .box {
        text-shadow: 1px 1px 2px black;
        background-color: transparent;

        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;

        width: 100%; height: 100%;

        padding: 0;
        font-size: 14px;
        color: var(--ha-picture-card-text-color, white);
        z-index: 1;
      }

      .box .card-header {
        padding: 10px 15px;
        font-weight: bold;
        font-size: 1.2em;
      }

      .box .sensors {
          margin-top: -19px;
          margin-bottom: -18px;
          min-height: 10px;
          margin-left: 5px;
          font-size: 0.9em;
          line-height: 13px;
      }

      .box .buttons {
          display: block;
          background-color: var( --ha-picture-card-background-color, rgba(0, 0, 0, 0.1) );
          background-color: transparent;
          text-align: right;
          padding-top: 10px;
          padding-bottom: 10px;
          min-height: 10px;
          width: 100%;

          margin-top:auto;
      }

      .box .buttons ha-icon-button {
            margin-left: -8px;
            margin-right: -6px;
            margin-bottom: -12px;
      }
      .box .sensors ha-icon-button {
            -moz-transform: scale(0.67);
            zoom: 0.67;
            vertical-align: middle;
            margin-bottom: -12px;
      }
      .box .wrapper {
          display: inline-block;
          vertical-align: middle;
      }
      .box ha-icon-button {
          color: var(--ha-picture-icon-button-color, #a9a9a9);
      }
      .box ha-icon-button.state-on {
          color: var(--ha-picture-icon-button-on-color, white);
      }


      .box .sensors .wrapper > * {
          display: inline-block;
          vertical-align: middle;
      }
      .box .sensors .state {
          margin-left: -9px;
          padding-top: 14px;
      }

      .box .wrapper hui-warning-element {
          margin-top: 15px;
      }
    `;
    }
}

customElements.define(cardType, MinimalisticAreaCard);

const theWindow = window as any;
theWindow.customCards = theWindow.customCards || [];
theWindow.customCards.push({
    type: cardType,
    name: "Minimalistic Area",
    preview: true, // Optional - defaults to false
    description: "Minimalistic Area Card" // Optional
});