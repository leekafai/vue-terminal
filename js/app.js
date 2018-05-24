var app = new Vue({
  el: '#terminal',
  data: {
    active: 0,
    pos: $('.cmd').caret(),
    content: '',
    content_after: '',
    cursor_text: '',
    content_before: '',
    output: [{ prompt: '', content: 'Welcome<br>But i`m not ready for work right now;', class: 'upcase welcome goblind' }],
    history: [],
    input_enable: 1,
    historyStep: 0,
    content_n: [ ]
    },
    computed: {
    },
    methods: {
      arrow_l: function () {
        console.log('arrow_left')
        var cursor_l = this.content.length
        this.pos = $('.cmd').caret()
        this.editvis()
      },
      arrow_r: function () {
        console.log('arrow_right')
        var cursor_l = this.content.length
        this.pos = $('.cmd').caret()
        // console.log(this.pos + "/" + cursor_l)
        this.editvis()
        // console.log(this.content_before)
        // console.log("|")
        // console.log(this.content_after)

      },
      arrow_u: function (event) {
        var step = ++this.historyStep
        console.log(step + ':' + this.history.length)
        if (this.history.length > 0) {
          if (this.history.length >= step) {
            this.content = this.history[this.history.length - step]
            this.pos = this.content.length
            this.editvis()
          }else { // 当前向上遍历到最早的一条
            console.warn('top now')
            console.log(this.historyStep)
          }
        }else {
          console.warn('no history')
        }
      },
      arrow_d: function (event) {
        var step = Math.abs(--this.historyStep)
        console.log(step + ':' + this.history.length)
        if (this.history.length > 0 && this.history.length - step >= 1) {
          if (this.history.length >= step) {
            this.content = this.history[this.history.length - step]
            console.log('~~' + this.history[this.history.length - step])
            this.pos = this.content.length
            this.editvis()
            console.log(this.content + '//' + this.content.before)
            console.log('1=' + this.pos)
            console.log('2=' + $('.cmd').caret())
            console.warn(this.content.length)

            console.log('3=' + $('.cmd').caret())
            console.log('4=' + this.pos)
            console.log('h:' + this.history)
            console.log('prv' + this.content)
          }else { // 当前向上遍历到最早的一条
            console.warn('top now')
            this.historyStep = 0
            step = 0
          }
        }else {
          console.warn('no history')
        }
      },
      format_output: function () {
        if (this.output.length > 30) {
          var sublength = this.output.length - 30
          this.output.splice(0, sublength)
        }
      },

      historySelect: function () {
        // var step = ++this.historyStep
        // prev = function () {
        //     return this.history[this.history.length - step - 1]
        // }
        // return prev
        // console.log('prv' + prev)
      },

      submit: function () {
        if (this.commend(this.content)) {
          console.warn('commend')
        }else {
          if (this.content) {
            var message = { prompt: 'USER', content: this.xss(this.content) }
            this.output.push(message)
            this.format_output()
            this.historySet(message)
          }
        }
        console.log(this.output)
        this.content = ''
        this.content_n.length = 0
        this.editvis()
      },
      keypress: function () {
        console.log('keypress')
        var cursor_l = 0
        this.pos = $('.cmd').caret()
        if (this.content) {
          cursor_l = this.content.length
        }
        this.editvis()

        console.log(this.pos + '/' + cursor_l)
        console.log(this.content_before)
        console.log(this.cursor_text)
        console.log(this.content_after)
      },
      commend: function (str) {
        var allow = 0
        if (!str) {
          return 0
        }
        switch (str) {
          case 'help':
            allow = 1
            var message = { prompt: 'HELP', content: 'no help;' }
            this.output.push(message)
            break
          case 'clean':
            allow = 1
            this.output.length = 0
        }
        return allow
      },
      editvis: function () {
        console.log(this.pos)
        var count = 0
        var linelim = 20
        a = this.$refs.commend.offsetWidth
        b = this.$refs.prompt.offsetWidth
        c = this.$refs.ctx1.offsetWidth
        d = this.$refs.cursor.offsetWidth
        e = this.$refs.ctx2.offsetWidth
        if (this.content_n.length > 0) { // 换行后
          if (this.content_before.length > linelim) { // 没有空间了
            this.content_n.push(this.content_before)
            this.content_before = ''
          }
          this.content_n.map(function (str) {
            num = str.length
            count += num
          })
          if (this.pos == this.content.length) {
            this.content_after = ''
            this.cursor_text = ''
            this.content_before = this.xss(this.content.substr(count))
          }else { // pos<cursor_l
            this.content_after = this.xss(this.content.substr(this.pos + 1))
            this.cursor_text = this.xss(this.content.substr(this.pos, 1))
            this.content_before = this.xss(this.content.substr(count, this.pos - count))
          }
        }else { // 未换行

          if (this.pos == this.content.length) {
            this.content_after = ''
            this.cursor_text = ''
            this.content_before = this.xss(this.content)
          }else { // pos<cursor_l
            this.content_after = this.xss(this.content.substr(this.pos + 1))
            this.cursor_text = this.xss(this.content.substr(this.pos, 1))
            this.content_before = this.xss(this.content.substr(0, this.pos))
          }
          if (this.content.length > linelim) { // 没有空间了
            this.content_n.push(this.content_before)
            this.content_before = ''
          }
        }
      },
      xss: function (str) {
        str = str.replace(/</g, '&lt;')
        str = str.replace(/>/g, '&gt;')
        str = str.replace(/\s/g, '&nbsp;')
        return str
      },
      historySet: function (message) {
        this.history.push(message.content)
        this.historyStep = this.history.length
      },
      blur: function () {
        $('#cmd').blur()
      },
      focus: function (message, event) {
        $('#cmd').focus()
      }

    }

  })

  Vue.directive('demo', {
    bind: function (el, binding, vnode) {
      var s = JSON.stringify

      el.innerHTML =
        'name: ' + s(binding.name) + '<br>' +
        'value: ' + s(binding.value) + '<br>' +
        'expression: ' + s(binding.expression) + '<br>' +
        'argument: ' + s(binding.arg) + '<br>' +
        'modifiers: ' + s(binding.modifiers) + '<br>' +
        'vnode keys: ' + Object.keys(vnode).join(', ')
      console.log($(el).height('10px'))
    }

  })
