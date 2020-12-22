import { text } from '@storybook/addon-knobs';
import { HelloWorldComponent } from './hello-world.component';

export default {
  title: 'HelloWorldComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: HelloWorldComponent,
  props: {
    message: text('message', ''),
  }
})
