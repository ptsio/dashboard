import dashboard from './dashboard'
import userAndAuthentication from './user-and-authentication'
import transactions from './transactions'
import siteAndPlans from './sites-and-plans'
import configDefaults from './config-defaults'
import emailNewsletter from './messaging-and-newsletter'

export default [
  ...dashboard, ...userAndAuthentication, ...transactions, ...siteAndPlans, ...emailNewsletter, ...configDefaults,
]
