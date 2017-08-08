import { IdeaPoolPage } from './app.po';

describe('idea-pool App', () => {
  let page: IdeaPoolPage;

  beforeEach(() => {
    page = new IdeaPoolPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
