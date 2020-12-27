const automator = require('miniprogram-automator')

describe('index', () => {
  let miniProgram
  let page

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: '../'
    })
    page = await miniProgram.reLaunch('/pages/index/index')
    await page.waitFor(500)
  }, 40000)
  let tabbar
  let tabbar_item
  it('check tabbar and tab switch', async () => {
    tabbar = await page.$('.tabbar')
    tabbar_item = await tabbar.$$('.action')
    expect(tabbar_item.length).toBe(4)
    expect(await tabbar_item[1].attribute('data-cur')).toBe('activity')
    let component = await page.$$('userInfo')
    expect(component.length).toBe(0)
    tabbar_item[3].tap()
    await page.waitFor(200)
    component = await page.$$('userInfo')
    expect(component.length).toBe(1)
  })
  it('check recommend list and tap navigation', async () => {
    page = await miniProgram.currentPage()
    tabbar_item[0].tap()
    await page.waitFor(200)
    let playground = await page.$('playground')
    let club_lists = await playground.$$('.grid')
    expect(club_lists.length).toBe(1)
    let recommend_list = club_lists[0]
    let items = await recommend_list.$$('.cu-item')
    expect(items.length).not.toBe(0)
    let pic = await items[0].$('.cu-avatar')
    pic.tap()
    await page.waitFor(500)
    page = await miniProgram.currentPage()
    expect(page.path).toBe('pages/club/frontpage/frontpage')
    await miniProgram.navigateBack()
    page = await miniProgram.currentPage()
    expect(page.path).toBe('pages/index/index')
  })
  it('check all club list and tap navigation', async () => {
    page = await miniProgram.currentPage()
    tabbar_item[0].tap()
    await page.waitFor(100)
    let playground = await page.$('playground')
    let club_lists = await playground.$$('.club-card')
    expect(club_lists.length).not.toBe(0)
    club_lists[0].tap()
    await page.waitFor(500)
    page = await miniProgram.currentPage()
    expect(page.path).toBe('pages/club/frontpage/frontpage')
    await miniProgram.navigateBack()
    page = await miniProgram.currentPage()
    expect(page.path).toBe('pages/index/index')
  })
  it('check activity list and tap navigation', async () => {
    page = await miniProgram.currentPage()
    tabbar_item[1].tap()
    await page.waitFor(200)
    let activity = await page.$('activity')
    let activity_list = await activity.$('.grid')
    let items = await activity_list.$$('.cu-item')
    let pic = []
    for(let item of items){
      pic.push(await item.$('.cu-avatar'))
    }
    expect(pic.length).not.toBe(0)
    pic[0].tap()
    await page.waitFor(500)
    expect((await miniProgram.currentPage()).path).toBe('pages/activity/activity_detail/activity_detail')
    await miniProgram.navigateBack()
    expect((await miniProgram.currentPage()).path).toBe('pages/index/index')
  })
  it('check user info and tap navigation', async () => {
    page = await miniProgram.currentPage()
    tabbar_item[3].tap()
    await page.waitFor(100)
    let userInfo = await page.$$('userInfo')
    expect(userInfo.length).toBe(1)
    let avatar = await userInfo[0].$$('.cu-avatar')
    expect(avatar.length).toBe(1)
    avatar[0].tap()
    await page.waitFor(500)
    expect((await miniProgram.currentPage()).path).toBe('pages/userInfo/selfie/selfie')
    await miniProgram.navigateBack()
    expect((await miniProgram.currentPage()).path).toBe('pages/index/index')
  })
  it('check message and tap navigation', async () => {
    page = await miniProgram.currentPage()
    tabbar_item[2].tap()
    await page.waitFor(100)
    let message = await page.$$('message')
    expect(message.length).toBe(1)
    let scroll_view = await message[0].$$('scroll-view')
    expect(scroll_view.length).toBe(1)
    let tabs = await scroll_view[0].$$('.cu-item')
    expect(tabs.length).toBe(3)
  })
  afterAll(async () => {
    await miniProgram.close()
  })
})