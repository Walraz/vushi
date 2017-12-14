<template lang="pug">
  Grid(:size="2" :gutter="16" between gridCenter maxWidth="500")
    Cell
      Textfield(mobileFullscreen icon="clear" required label="Label" placeholder="Välj ett alternativ" :options="options" v-model="selected" multiple autosuggestion)
    Cell
      Textfield(mobileFullscreen label="Husdjur" placeholder="Välj ett alternativ" required icon="clear" :options="optionsArray" v-model="selected2" autosuggestion)
    Cell
      Textfield(mobileFullscreen icon="clear" autosuggestion :options="optionsArray" v-model="selected2" label="Husdjur")
    Cell(center :pa="8" )
      Checkbox(v-model="check" checkValue="Blue" label="Accpetera")
    Cell
      Textfield(mobileFullscreen label="Label" type="password" placeholder="Write..." required icon="visibility" v-model="text2")
    Cell
      Textfield(mobileFullscreen label="Email" type="email" v-model="text")
    Cell
      MyButton(@click="submit") Validera
    Cell
      Grid(end)
        Cell(style="font-size: 32px")
          Spinner
        h1 {{ validText }}
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
import Cell from '../src/components/Cell'
import Grid from '../src/components/Grid'
import Textfield from '../src/components/Textfield'
import MyButton from './MyButton'
import Spinner from '../src/components/Spinner'
import Icon from '../src/components/Icon'
import Checkbox from '@/components/Checkbox'

export default {
  name: 'app',

  components: {
    Cell,
    Grid,
    Checkbox,
    MyButton,
    Spinner,
    Icon,
    Textfield,
  },

  data() {
    return {
      validText: '',
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
      text2: '',
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
    submit() {
      if (this.$_isValid()) this.validText = 'OK'
      else this.validText = 'error'
    },
    iconFn() {
      console.log('custom icon function')
    },
    onClear() {
      console.log('clear')
    },
    toggleLoading() {
      this.loading = !this.loading
    },
  },
}
</script>
