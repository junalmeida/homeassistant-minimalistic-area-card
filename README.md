# Minimalistic Area Card

A minimalistic area card to have a control panel of your house on your dashboard. This card will show numeric sensors with its value, and binary sensors with only the icon. Switches and lights will have their own button that you can tap/click to toggle, or tap/click and hold to see detailed information.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Sample preview](docs/sample.png)

Please consider sponsoring if you feel that this project is somehow useful to you.  
[![BuyMeCoffee][buymecoffeebadge]][buymecoffee]

## Options

For entity options, see https://www.home-assistant.io/dashboards/entities/#options-for-entities.

For `tap_action` options, see https://www.home-assistant.io/dashboards/actions/.

```yaml
- type: custom:minimalistic-area-card
  title: Living Room
  image: /local/img/living-room.jpg #any image file on /config/www or an absolute image url. optional, it uses area image if area is specified. (optional)
  area: living_room # area id of an existing area defined in HA. (optional)
  background_color: yellow # a color name, rgb hex or rgba function when an image is not provided (optional)
  camera_image: camera.living_room # a camera entity to use as background (optional)
  camera_view: 'auto' # auto, live (optional)
  shadow: true # Draws a drop shadow on icons (optional)
  hide_unavailable: false # Hide unavailable entities (optional)
  state_color: true # enable or disable HA colors for all entities
  darken_image: true # reduce brightness of the background image to constrast with entities
  tap_action:
    action: navigate
    navigation_path: /lovelace/living-room
  entities: #optional, lists area entities automatically if ommited.
    - entity: media_player.living_room_tv
      state_color: false # enable or disable HA colors for this entity
      shadow: true # enable a drop shadow on entity icons to contrast with the background
    - entity: switch.fireplace_on_off
    - entity: cover.window_covering
      tap_action:
        action: toggle
    - entity: media_player.speaker
    - entity: light.living_room_lamp
    - entity: sensor.hallway_humidity
    - entity: sensor.hallway_temperature
```

[commits-shield]: https://img.shields.io/github/commit-activity/y/junalmeida/homeassistant-minimalistic-area-card.svg?style=for-the-badge
[commits]: https://github.com/junalmeida/homeassistant-minimalistic-area-card/commits/main
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[discord]: https://discord.gg/5e9yvq
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/c/projects/frontend
[license-shield]: https://img.shields.io/github/license/junalmeida/homeassistant-minimalistic-area-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2021.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/junalmeida/homeassistant-minimalistic-area-card.svg?style=for-the-badge
[releases]: https://github.com/junalmeida/homeassistant-minimalistic-area-card/releases
[buymecoffee]: https://www.buymeacoffee.com/junalmeida
[buymecoffeebadge]: https://img.shields.io/badge/buy%20me%20a%20coffee-donate-orange?style=plastic&logo=buymeacoffee
