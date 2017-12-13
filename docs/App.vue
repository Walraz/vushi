<template lang="pug">
  .flex
    div(style="width: 100%")
    Textfield(mobileFullscreen autofocus icon="clear" required label="Label" placeholder="Välj ett alternativ" selectTab :options="options" v-model="selected" multiple autosuggestion)
    Textfield(mobileFullscreen label="Husdjur" placeholder="Välj ett alternativ"  required icon="clear" selectTab :options="optionsArray" v-model="selected2" autosuggestion)
    Textfield(mobileFullscreen icon="clear" autosuggestion :options="optionsArray" v-model="selected2" label="Husdjur")
    Textfield(mobileFullscreen label="Label" type="password" :validate="validationEmail" placeholder="Write..." required icon="visibility" v-model="text")
    //- MyButton(fullWidth) Spara händelse
    //- MyButton(disabled) Spara händelse
    //- MyButton(@click="toggleLoading") Spara händelse
    //- MyButton(:loading="loading" @click="toggleLoading" primary)
    //-   Icon(slot="icon") close
    //-   | Hämtar
    //- MyButton(fab)
    //-   Icon bookmark
    //- Textfield(label="Label" v-model="model.username" placeholder="Placeholder")
    //- Textfield(label="Label" v-model="model.password" type="password" icon="visibility")
    //- Textfield(style="min-width: 300px" max-length="4" required label="Label" v-model="model.name" icon="clear" :validateOn="validated" :validate="{ required: true, maxLength: 3 }")
    //- MyButton(@click="submit")
    //-   | Validate
    //- MyTextfield(v-model="model.name" :validate="{ includesChar: '.' }")
    //- MyTextfield(autosuggestion icon="clear" :options="options" label="Select" :validate="{required: true}" v-model="selected")
    //- MyTextfield(:options="optionsArray" autosuggestion icon="clear" label="Select" v-model="selected2")
    //- MyTextfield(:options="options" icon="clear" label="Select" :validate="{required: true}" v-model="selected")
    //- MyTextfield(:options="optionsArray" icon="clear" label="Select" v-model="selected2")
    //- Checkbox(disabled v-model="check" checkValue="Red" label="Red")
    //- Checkbox(v-model="check" checkValue="Blue")
    //- Checkbox(disabled v-model="CheckBool")
</template>


<script>
import Textfield from '../src/components/Textfield'
import MyButton from './MyButton'
import Spinner from '../src/components/Spinner'
import Icon from '../src/components/Icon'
import Checkbox from '@/components/Checkbox'

export default {
  name: 'app',

  components: {
    Checkbox,
    MyButton,
    Spinner,
    Icon,
    Textfield,
  },

  data() {
    return {
      validationEmail: {
        email: {
          message: 'Noo...',
        },
        includesChar: {
          param: 'e',
          message: 'Not right char',
        },
      },
      CheckBool: true,
      check: null,
      selected: [false],
      selected2: 'item 2',
      validated: false,
      text: '',
      loading: false,
      multiple: [],
      model: {
        password: 'test',
        username: 'test',
        name: '',
      },
      optionsArray: ['item 1', 'item 2', 'lol', 'hund', 'katt', 'cool item'],
      // options: [{ label: 'Nej', value: false }, { label: 'Ja', value: true }],
      options: [],
    }
  },

  mounted() {
    // this.selected = []
    setTimeout(() => {
      this.selected = [false]
      // this.selected2 = null
      this.options = [
        { id: 1, label: 'Car', value: { car: true } },
        { id: 2, label: 'Nej', value: false },
        { id: 3, label: 'Vet ej', value: null },
      ]
    }, 2000)
  },

  methods: {
    iconFn() {
      console.log('custom icon function')
    },
    onClear() {
      console.log('clear')
    },
    submit() {
      this.validated = !this.validated
    },
    toggleLoading() {
      this.loading = !this.loading
    },
  },
}
</script>

<style lang="stylus">
.flex
  position relative
  display flex
  align-items flex-start
  flex-wrap wrap
  margin 0
</style>
