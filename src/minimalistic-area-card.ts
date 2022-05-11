/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ActionHandlerEvent,
    EntityConfig,
    handleAction, hasAction, hasConfigOrEntityChanged, HomeAssistant
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { ifDefined } from "lit/directives/if-defined";
import { actionHandler } from './action-handler-directive';
import { findEntities } from './find-entities';
import { MinimalisticAreaCardConfig } from './types';

/* eslint no-console: 0 */
console.info(
    `%c  Minimalistic Area Card  %c 1.0.5 `,
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


class MinimalisticAreaCard extends LitElement {
    static properties = {
        hass: { attribute: false },
        config: { state: true }
    };

    private hass!: HomeAssistant;
    private config!: MinimalisticAreaCardConfig;

    _entitiesDialog: Array<EntityConfig> = [];
    _entitiesToggle: Array<EntityConfig> = [];
    _entitiesSensor: Array<EntityConfig> = [];

    parseEntity(item: EntityConfig | string) {
        if (typeof item === "string")
            return {
                entity: item
            } as EntityConfig;
        else
            return item;
    }

    _handleAction(ev: ActionHandlerEvent) {
        const config = (ev.currentTarget as any).config;
        handleAction(this, this.hass, config, ev.detail.action);
    }
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config: MinimalisticAreaCardConfig) {

        if (
            !config ||
            !config.entities ||
            !Array.isArray(config.entities) ||
            !(config.image || config.camera_image || config.state_image) ||
            (config.state_image && !config.entity)
        ) {
            throw new Error("Invalid configuration");
        }

        this._entitiesDialog = [];
        this._entitiesToggle = [];
        this._entitiesSensor = [];

        config.entities.forEach((item) => {

            const entity = this.parseEntity(item);
            const [domain, _] = entity.entity.split('.');
            if (SENSORS.indexOf(domain) !== -1) {
                this._entitiesSensor.push(entity);
            }
            else if (
                config.force_dialog ||
                DOMAINS_TOGGLE.indexOf(domain) === -1
            ) {
                this._entitiesDialog.push(entity);
            } else {
                this._entitiesToggle.push(entity);
            }
        });

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
        let imageUrl: string | undefined = undefined;
        if (this.config.image) {
            imageUrl = (new URL(this.config.image, this.hass.auth.data.hassUrl)).toString();
        }

        return html`
<ha-card>
    ${imageUrl ? html`<img src=${imageUrl} />` : null}
    <div class="box">
        <div class="title"
            @action=${this._handleAction}
            .actionHandler=${actionHandler({
              hasHold: hasAction(this.config.hold_action),
              hasDoubleClick: hasAction(this.config.double_tap_action),
            })}
            tabindex=${ifDefined(
              hasAction(this.config.tap_action) ? "0" : undefined
            )}
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
        entityConf,
        dialog,
        isSensor
    ) {
        const stateObj = this.hass.states[entityConf.entity];

        entityConf = {
            tap_action: { action: dialog ? "more-info" : "toggle" },
            hold_action: { action: "more-info" },
            ...entityConf,
        };

        if (!stateObj) {
            return html`
            <div class="wrapper">
                <hui-warning-element .label=${createEntityNotFoundWarning(this.hass, entityConf.entity)}></hui-warning-element>
            </div>
      `;
        }


        return html`
    <div class="wrapper">
        <ha-icon-button @action=${this._handleAction} .actionHandler=${actionHandler({ hasHold:
            hasAction(entityConf.hold_action), hasDoubleClick: hasAction(entityConf.double_tap_action), })}
            .config=${entityConf} class=${classMap({ "state-on" : stateObj.state && [...STATES_OFF, "unavailable" , "idle"
            , "disconnected" ].indexOf(stateObj.state.toString().toLowerCase())===-1, })}>
            <ha-state-icon .icon=${entityConf.icon} .state=${stateObj}></ha-state-icon>
        </ha-icon-button>
        ${isSensor ? html`
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

    static getStubConfig(hass,
        entities,
        entitiesFallback) {
        const lights = findEntities(
            hass,
            2,
            entities,
            entitiesFallback,
            ["light"]
        );
        const switches = findEntities(
            hass,
            2,
            entities,
            entitiesFallback,
            ["switch"]
        );

        const sensors = findEntities(
            hass,
            2,
            entities,
            entitiesFallback,
            ["sensor"]
        );
        const binary_sensors = findEntities(
            hass,
            2,
            entities,
            entitiesFallback,
            ["binary_sensor"]
        );

        return {
            title: "Kitchen",
            image: "https://demo.home-assistant.io/stub_config/kitchen.png",
            entities: [...lights, ...switches, ...sensors, ...binary_sensors],
        };
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

      .box .title {
        padding: 10px 15px;
        font-weight: bold;
        font-size: 1.2em;
      }
      
      .box .sensors {
          white-space: nowrap;
          margin-top: -19px;
          margin-bottom: -18px;
          min-height: 10px;
          margin-left: 5px;
          font-size: 0.9em;
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

customElements.define('minimalistic-area-card', MinimalisticAreaCard);

const theWindow = window as any;
theWindow.customCards = theWindow.customCards || [];
theWindow.customCards.push({
    type: "minimalistic-area-card",
    name: "Minimalistic Area",
    preview: true, // Optional - defaults to false
    description: "Minimalistic Area Card" // Optional
});