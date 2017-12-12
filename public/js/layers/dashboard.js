export function createDashboardLayer(font, playerEnv) {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const coins = 13;

  return function drawDashboard(ctx) {
    const { score, time } = playerEnv.playerController;

    font.print('MARIO', ctx, 16,LINE1);
    font.print(score.toString().padStart(6, '0'), ctx, 16,LINE2);

    font.print(`@x${coins.toString().padStart(2, '0')}`, ctx, 96,LINE2);

    font.print('WORLD', ctx, 152,LINE1);
    font.print('1-1', ctx, 160,LINE2);

    font.print('TIME', ctx, 208,LINE1);
    font.print(time.toFixed().padStart(3, '0'), ctx, 216,LINE2);
  };
}