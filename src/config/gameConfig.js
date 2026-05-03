// src/config/gameConfig.js

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 300;
export const GROUND_Y = 260;

export const PLAYER_X = 120;
export const PLAYER_JUMP_VELOCITY = -520;
export const GRAVITY = 1400;

export const OBSTACLE_SPEED_INITIAL = 300;
export const OBSTACLE_SPEED_INCREMENT = 15; // added per score milestone
export const OBSTACLE_SPEED_MILESTONE = 10;  // every N score points

export const SPAWN_DELAY_MIN = 1100; // ms
export const SPAWN_DELAY_MAX = 2400; // ms

export const COLORS = {
  sky:          0x1a1a2e,
  ground:       0x16213e,
  groundLine:   0x0f3460,
  playerBody:   0x111111,
  playerEye:    0x00ff88,
  playerPupil:  0x003322,
  obstacle:     0x8B4513,
  obstaclePlank:0xA0522D,
  scoreText:    0x00ff88,
  streetLight:  0xffd700,
  building:     0x0d1b2a,
  buildingWin:  0x1a3a5c,
  moon:         0xf0e6d3,
};
