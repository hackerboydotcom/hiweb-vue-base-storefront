<template>
  <div class="hiweb-contact-form">
    <h3 class="hiweb-contact-form__heading">{{ title ? title : 'Contact us' }}</h3>

    <div class="hiweb-contact-form__form">

      <div class="hiweb-contact-form__form__input hiweb-contact-form__form__input--name">
        <input class="hiweb-contact-form__form__input__name" type="text" v-model="name" placeholder="Your name" />
      </div>

      <div v-if="!hidePhone" class="hiweb-contact-form__form__input hiweb-contact-form__form__input--phone">
        <input class="hiweb-contact-form__form__input__phone" type="text" v-model="phone" placeholder="Phone number" />
      </div>

      <div class="hiweb-contact-form__form__input hiweb-contact-form__form__input--email">
        <input class="hiweb-contact-form__form__input__email" type="text" v-model="email" placeholder="Email" />
      </div>

      <div class="hiweb-contact-form__form__input hiweb-contact-form__form__input--message">
        <textarea class="hiweb-contact-form__form__input__message" v-model="message" placeholder="Your message"></textarea>
      </div>

      <div v-if="errors && errors.length" class="hiweb-contact-form__form__errors">
        <p v-for="error in errors" class="hiweb-contact-form__form__errors__error">
          {{ error.title }}
        </p>
      </div>

      <div v-if="isSuccess" class="hiweb-contact-form__form__success">
        <p class="hiweb-contact-form__form__success__message">{{ successMessage ? successMessage : 'Thank you for contacting us, we received your message and will get back to you shortly.' }}</p>
      </div>

      <div class="hiweb-contact-form__form__submit">
        <button class="hiweb-contact-form__form__submit__button" :disabled="isSending" @click="send">
          {{ isSending ? 'Sending' : 'Send message' }}
        </button>
      </div>

    </div>

  </div>
</template>

<script type="text/javascript">
import mixin from '../../mixins/components/contact-form';

export default {

  mixins: [mixin],


}
</script>

<style type="text/css">
.hiweb-contact-form input, .hiweb-contact-form textarea {
  margin: 0;
  max-width: 100%;
  -webkit-box-flex: 1;
  -ms-flex: 1 0 auto;
  flex: 1 0 auto;
  outline: 0;
  -webkit-tap-highlight-color: rgba(255,255,255,0);
  text-align: left;
  line-height: 1.21428571em;
  padding: .67857143em 1em;
  background: #fff;
  border: 1px solid rgba(34,36,38,.15);
  color: rgba(0,0,0,.87);
  border-radius: .28571429rem;
  -webkit-transition: border-color .1s ease,-webkit-box-shadow .1s ease;
  transition: border-color .1s ease,-webkit-box-shadow .1s ease;
  transition: box-shadow .1s ease,border-color .1s ease;
  transition: box-shadow .1s ease,border-color .1s ease,-webkit-box-shadow .1s ease;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.hiweb-contact-form__heading {
  padding: 0px 10px; 
}

.hiweb-contact-form__form__input, .hiweb-contact-form__form__errors, .hiweb-contact-form__form__success, .hiweb-contact-form__form__submit {
  display: inline-block;
  width: 50%;
  padding: 10px;
}

.hiweb-contact-form__form__input--message, .hiweb-contact-form__form__input input, .hiweb-contact-form__form__input textarea, .hiweb-contact-form__form__errors, .hiweb-contact-form__form__success {
  width: 100%;
}

.hiweb-contact-form__form__input textarea {
  height: 180px;
}

.hiweb-contact-form__form__submit__button {
  background-color: #f5f5f5;
  border-color: transparent;
  border-width: 1px;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  padding-bottom: calc(.375em - 1px);
  padding: .75em;
  text-align: center;
  white-space: nowrap;
}
</style>