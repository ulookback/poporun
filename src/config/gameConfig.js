// src/config/gameConfig.js

export const GAME_WIDTH  = 800;
export const GAME_HEIGHT = 300;
export const GROUND_Y    = 274;  // top of stone floor in background image

export const PLAYER_X             = 120;
export const PLAYER_JUMP_VELOCITY = -520;
export const GRAVITY              = 1400;

export const OBSTACLE_SPEED_INITIAL   = 300;
export const OBSTACLE_SPEED_INCREMENT = 12;
export const OBSTACLE_SPEED_MILESTONE = 10; // every 10 seconds

export const SPAWN_DELAY_MIN = 800;
export const SPAWN_DELAY_MAX = 1800;

export const CEILING_Y = 30;

export const COLORS = {
  sky:          0x0d0005,
  caveCeiling:  0x1a0508,
  ground:       0x2d0a08,
  groundLine:   0xff4400,
  lavaBright:   0xff6600,
  lavaMid:      0xdd3300,
  lavaDark:     0x880000,
  lavaGlow:     0xff2200,
  rockDark:     0x1a0a08,
  rockMid:      0x3a1510,
  rockLight:    0x5a2018,
  fireLo:       0xff2200,
  fireMid:      0xff6600,
  fireHi:       0xffcc00,
  scoreText:    0xff6600,
};
