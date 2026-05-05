// src/config/gameConfig.js

export const GAME_WIDTH  = 800;
export const GAME_HEIGHT = 300;
export const GROUND_Y    = 255;  // slightly higher — room for lava pool below

export const PLAYER_X           = 120;
export const PLAYER_JUMP_VELOCITY = -520;
export const GRAVITY            = 1400;

export const OBSTACLE_SPEED_INITIAL   = 300;
export const OBSTACLE_SPEED_INCREMENT = 12;  // px/s added per milestone
export const OBSTACLE_SPEED_MILESTONE = 10;  // every 10 seconds (1pt = 1sec)

export const SPAWN_DELAY_MIN = 800;   // ms  — denser than before for hell chaos
export const SPAWN_DELAY_MAX = 1800;  // ms

export const CEILING_Y = 30;   // y position of the cave ceiling

export const COLORS = {
  // Sky / environment
  sky:          0x0d0005,   // near-black deep red-tinted void
  caveCeiling:  0x1a0508,   // dark rock ceiling
  caveWall:     0x2a0a0e,   // mid-cave rock
  ground:       0x2d0a08,   // dark lava rock floor
  groundLine:   0xff4400,   // glowing lava crack at ground level
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
  // Score
  scoreText:    0xff6600,
};
