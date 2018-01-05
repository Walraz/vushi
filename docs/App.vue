<template lang="pug">
  Grid(:size="2" :gutter="16" between gridCenter maxWidth="500")
    Cell
      Textfield(mobileFullscreen icon="clear" required label="Label" placeholder="Välj ett alternativ" :options="options" v-model="selected" multiple autosuggestion)
    Cell
      Textfield(mobileFullscreen icon="clear" required label="Label" placeholder="Välj ett alternativ" :options="options" v-model="selected" multiple autosuggestion)
    Cell
      Textfield(mobileFullscreen label="Husdjur" placeholder="Välj ett alternativ" required icon="clear" :options="optionsArray" v-model="selected2" autosuggestion)
    Cell
      Textfield(mobileFullscreen icon="clear" autosuggestion :options="optionsArray" v-model="selected2" label="Husdjur")
    Cell(center :pa="8" )
      Checkbox(v-model="check" checkValue="Blue" label="Blue")
      Radio(v-model="check" radioValue="Blue" label="Blue")
      Radio(v-model="check" radioValue="White" label="White")
    Cell(center :pa="8" )
      Toggle(v-model="check" checkValue="Blue" label="Accpetera")
    Cell
      Textfield(mobileFullscreen label="Label" type="password" placeholder="Write..." required icon="visibility" v-model="text2")
    Cell
      Textfield(mobileFullscreen label="Email" type="email" v-model="text")
    Cell
      Textfield(mobileFullscreen label="Datepicker" v-model="date" icon="clear" placeholder="yyyy-mm-dd")
        Calendar(v-model="date" yearMonthPicker)
    Cell
      Textfield(label="Datepicker" type="date" v-model="date")
    Cell
      Textfield(label="Time" type="time" v-model="time")
    Cell
      Textfield(autogrow textarea v-model="text" required label="Textarea")
    Cell
      MyButton(@click="submit") Validera
    Cell
      Grid(end)
        h1 {{ validText }}
    Grid
      Calendar(v-model="date" yearMonthPicker)
</template>


<script>
import Calendar from '../src/components/Calendar'
import Radio from '../src/components/Radio'
import MyToggle from './MyToggle'
import Toggle from '../src/components/Toggle'
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
    Calendar,
    Radio,
    MyToggle,
    Toggle,
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
      time: null,
      date: null,
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
      // this.date = '2017-12-12'
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
