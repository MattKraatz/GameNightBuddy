import { GameNightBuddyPage } from './app.po';

describe('game-night-buddy App', () => {
  let page: GameNightBuddyPage;

  beforeEach(() => {
    page = new GameNightBuddyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
