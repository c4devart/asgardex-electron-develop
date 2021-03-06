import { Route } from './types'

export const base: Route<void> = {
  template: '/',
  path() {
    return this.template
  }
}

export const settings: Route<void> = {
  template: '/settings',
  path() {
    return this.template
  }
}
