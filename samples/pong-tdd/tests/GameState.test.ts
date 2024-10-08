import { beforeEach, describe, test } from "vitest";
import { GameState } from "../src/state/GameState";
import { BALL_SPEED, HALF_HEIGHT, HALF_WIDTH, HEIGHT, MAX_SCORE, PAD_HEIGHT, PAD_WIDTH, PLAYERS_SPEED, WIDTH } from "../src/CONSTANTS";

let state!: GameState;

beforeEach(() => {
  state = new GameState();
});


describe("GameState", () => {
  test("is not paused", ({ expect }) => {
    expect(state.paused).toBe(false);
  });

  describe("score", () => {
    test("has a score", ({ expect }) => {
      expect(state.score).toBeDefined();
    });

    test("has a score with player1 and player2", ({ expect }) => {
      expect(state.score.player1).toBe(0);
      expect(state.score.player2).toBe(0);
    });

    describe("#increasePlayer1Score()", () => {
      test("increases the score of player1", ({ expect }) => {
        state.increaseScore('player1');
        expect(state.score.player1).toBe(1);
      });
    });

    describe("#increasePlayer2Score()", () => {
      test("increases the score of player2", ({ expect }) => {
        state.increaseScore('player2');
        expect(state.score.player2).toBe(1);
      });
    });

    describe("when the score is equal to the max score", () => {
      beforeEach(() => {
        for (let i = 0; i < MAX_SCORE; i++) {
          state.increaseScore('player1');
        }
      });

      test("player1 wins", ({ expect }) => {
        expect(state.winner).toBe('player1');
      });
    });
  })

  test("has a ball with position and velocity", ({ expect }) => {
    expect(state.ball).toBeDefined();

    expect(state.ball.x).toBe(HALF_WIDTH);
    expect(state.ball.y).toBe(HALF_HEIGHT);
  });

  describe("#updateBall()", () => {
    test("updates the position based on the velocity", ({ expect }) => {
      state.ball.x = 100;
      state.ball.y = 100;
      state.ball.velocity = { x: 1, y: 1 };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.x).toBe(101);
      expect(state.ball.y).toBe(101);
    });

    test("inverts the y velocity when the ball hits the top", ({ expect }) => {
      state.ball.y = 0;
      state.ball.velocity = { x: 1, y: -1 };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.velocity.y).toBe(1);
    });

    test("inverts the y velocity when the ball hits the bottom", ({ expect }) => {
      state.ball.y = HEIGHT;
      state.ball.velocity = { x: 1, y: 1 };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.velocity.y).toBe(-1);
    });

    test("gets a point for player2 and pauses the game when the ball hits the left side", ({ expect }) => {
      state.ball.x = 0;
      state.ball.velocity = { x: -1, y: 1 };

      state.updateBall(1 / BALL_SPEED);

      expect(state.score.player2).toBe(1);
      expect(state.lastScored).toBe('player2');
      expect(state.paused).toBe(true);
    });

    test("gets a point for player1 and pauses the game when the ball hits the right side", ({ expect }) => {
      state.ball.x = WIDTH;
      state.ball.velocity = { x: 1, y: 1 };

      state.updateBall(1 / BALL_SPEED);

      expect(state.score.player1).toBe(1);
      expect(state.lastScored).toBe('player1');
      expect(state.paused).toBe(true);
    });

    test("does not get a point when the ball hits the right side", ({ expect }) => {
      state.ball.x = HEIGHT;
      state.ball.velocity = { x: 1, y: 1 };

      state.updateBall(1 / BALL_SPEED);

      expect(state.score.player1).toBe(0);
    });

    test("inverts the x velocity when the ball hits the player1 and speeds the ball up", ({ expect }) => {
      state.ball = { x: PAD_WIDTH - 1, y: HALF_HEIGHT, velocity: { x: -1, y: 1 } };
      state.player1 = { x: PAD_WIDTH, y: HALF_HEIGHT };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.velocity.x).toBe(1.05);
      expect(state.ball.velocity.y).toBe(1.05);
    });

    test("does not invert the x velocity when the direction is not congruent", ({ expect }) => {
      state.ball = { x: PAD_WIDTH - 1, y: HALF_HEIGHT, velocity: { x: 1, y: 1 } };
      state.player1 = { x: PAD_WIDTH, y: HALF_HEIGHT };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.velocity.x).toBe(1);
    });

    test("inverts the x velocity when the ball hits the player2 and speeds the ball up", ({ expect }) => {
      state.ball = { x: WIDTH - PAD_WIDTH, y: HALF_HEIGHT, velocity: { x: 1, y: 1 } };
      state.player2 = { x: WIDTH - PAD_WIDTH, y: HALF_HEIGHT };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.velocity.x).toBe(-1.05);
      expect(state.ball.velocity.y).toBe(1.05);
    });

    test("does not invert the x velocity when the direction is not congruent", ({ expect }) => {
      state.ball = { x: WIDTH - PAD_WIDTH, y: HALF_HEIGHT, velocity: { x: -1, y: 1 } };
      state.player1 = { x: WIDTH - PAD_WIDTH, y: HALF_HEIGHT };

      state.updateBall(1 / BALL_SPEED);

      expect(state.ball.velocity.x).toBe(-1);
    });
  });

  describe("#moveUp", () => {

    test("moves the player up", ({ expect}) => {
      state.player1 = { x: PAD_WIDTH, y: HALF_HEIGHT };
      state.moveUp('player1', 1 / PLAYERS_SPEED);

      expect(state.player1.y).toBe(HALF_HEIGHT - 1);
    });

    test("stops the player at the top", ({ expect }) => {
      state.player1 = { x: PAD_WIDTH, y: PAD_WIDTH };
      state.moveUp('player1', 1);

      expect(state.player1.y).toBe(PAD_HEIGHT * 0.5);
    });
  });

  describe("#moveDown", () => {
    test("moves the player down", ({ expect }) => {
      state.player1 = { x: PAD_WIDTH, y: HALF_HEIGHT };
      state.moveDown('player1', 1 / PLAYERS_SPEED);

      expect(state.player1.y).toBe(HALF_HEIGHT + 1);
    });

    test("stops the player at the bottom", ({ expect }) => {
      state.player1 = { x: PAD_WIDTH, y: HEIGHT - PAD_HEIGHT * 0.5 };
      state.moveDown('player1', 1);

      expect(state.player1.y).toBe(HEIGHT - PAD_HEIGHT * 0.5);
    });
  });

  describe('#reset', () => {
    test('resets the game with the direction to player1', ({ expect }) => {
      state.ball = { x: 100, y: 100, velocity: { x: 1, y: 1 } };
      state.player1 = { x: 100, y: 100 };
      state.player2 = { x: 100, y: 100 };
      state.lastScored = 'player1';

      state.reset();

      expect(state.ball.x).toBe(HALF_WIDTH);
      expect(state.ball.y).toBe(HALF_HEIGHT);
      expect(state.ball.velocity).toEqual({ x: -1, y: 1 });
    });

    test('resets the game with the direction to player2', ({ expect }) => {
      state.ball = { x: 100, y: 100, velocity: { x: 1, y: 1 } };
      state.player1 = { x: 100, y: 100 };
      state.player2 = { x: 100, y: 100 };
      state.lastScored = 'player2';

      state.reset();

      expect(state.ball.x).toBe(HALF_WIDTH);
      expect(state.ball.y).toBe(HALF_HEIGHT);
      expect(state.ball.velocity).toEqual({ x: 1, y: 1 });
    });

    test('resets the paused state', ({ expect }) => {
      state.paused = true;

      state.reset();

      expect(state.paused).toBe(false);
    });
  })
});

