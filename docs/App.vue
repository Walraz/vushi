<template lang="pug">
  .flex
    div(style="width: 100%")
    Textfield(icon="clear" selectTab :options="optionsArray" v-model="selected" multiple autosuggestion)
    Textfield(icon="clear" selectTab :options="optionsArray" v-model="selected2" autosuggestion)
    Textfield(icon="clear" v-model="text")
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
import Textfield from '@/components/Textfield'
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
      CheckBool: true,
      check: null,
      selected: null,
      selected2: null,
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
      options: [],
    }
  },

  mounted() {
    setTimeout(() => {
      this.selected = []
      this.options = [
        { id: 1, label: 'Ja', value: { car: false } },
        { id: 2, label: 'Nej', value: null },
        { id: 3, label: 'Vet ej', value: false },
      ]
    }, 1000)
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
html
  font-size 16px

.flex
  position relative
  display flex
  align-items flex-start
  flex-wrap wrap
  margin 0
</style>
