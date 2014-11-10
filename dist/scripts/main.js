var Registrant = Backbone.Model.extend({

      defaults: function(){
          return {
            username:    'guestuser',
            password:    'guest',
            email:       'guest@practichem.com'
        };
      },


});



var RegistrantList = Backbone.Collection.extend({
        model: Registrant
});






var RegistrationView = Backbone.View.extend({

  // className : 'main-container',

  el : '.main-container',

  initialize: function(){


      // console.log("Ready to do it!");
      // this.listenTo(this.collection, 'add', this.render);
      // this.listenTo(this.collection, 'change', this.render);
      // this.listenTo(this.collection, 'remove', this.render);
      // this.collection.fetch();
      webshim.polyfill('forms');
      this.render();
      self=this;
    },

    render: function(){
      $(this.el).load('registration.html');
      return this;
    },



    events: {
      'submit'  :   'submitRegistration',
      // 'click .submit'  :   'submitRegistration'
      // 'click .edit'     : 'editDoIt',
      // 'click .complete' : 'completeDoIt',
      // 'click .save'     : 'updateDoIt',
      // 'click .delete'   : 'deleteDoIt',
      // 'click .now'      : 'nowDoIt',
      // 'click .later'    : 'laterDoIt'
    },

    completeDoIt : function(e) {
        // var doIt = doItList.get($(e.currentTarget.parentElement).attr('id'));
        // doIt.set('status', 'completed');
        // $(e.currentTarget.parentElement).find('.summary').addClass('completed');
        // doIt.save();
      },

    submitRegistration: function(e) {
        e.preventDefault();
        self.clearErrors();
        var pw = $('input[id="password"]').val();
        var email = $('input[id="email"]').val();
        var username = $('input[id="username"]').val();
        if (!(self.validateEmail(email))) {
          return false;
        }
        if (!(self.validatePassword(pw))) {
          $('input[type="password"]').val('');
          return false;
        }
        if (!(self.confirmPasswordMatch())) {
          $('input[type="password"]').val('');
          return false;
        }
        $('#registrationStats').show();
        self.usernameCount(username.toLowerCase());
        self.addRegistrant(username);
        self.clearForm();
    },

    confirmPasswordMatch: function() {
        if ($('input[id="password"]').val() === $('input[id="confirm-password"]').val()) {
          console.log('Passwords match');
          return true;
        }
        else {
          self.renderError($('input[id="confirm-password"]'),'Passwords do not match');
          return false;
        }
    },

    /* could have used native browser validation with one pattern but prefer to have specific error messages */
    validatePassword: function(pw) {
        if (pw.length < 8) {
          self.renderError(($('input[id="password"]')),'Password must be at least 8 characters long');
          return false;
        }
        if (!((/[A-Z]/).test(pw))) {
          self.renderError(($('input[id="password"]')),'Password must contain at least one uppercase letter');
          return false;
        }
        if (!((/[a-z]/).test(pw))) {
          self.renderError(($('input[id="password"]')),'Password must contain at least one lowercase letter');
          return false;
        }
        if (!((/[0-9]/).test(pw))) {
          self.renderError(($('input[id="password"]')),'Password must contain at least one digit');
          return false;
        }
        return true;
    },

    /* regular expression from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    /* most likely will not be needed as native browser validation + webshim polyfill are activated  */
    validateEmail: function(email) {
          if (!((/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email))) {
            self.renderError(($('input[id="email"]')), 'Enter a valid email address');
            return false;
          }
        return true;
    },

    renderError: function(element,msg) {
        $(element).siblings('.error-msg').html(msg);
    },

    clearErrors: function() {
        $('.error-msg').html('');
    },

    clearForm: function() {
        $('li > input').val('');
    },

    usernameCount: function(username) {

        $('#userCharCount .results').html('');
        var letters = [];
        var letter;
        var count;
        for (i = 0; i < username.length; i++) {
          var letter = username[i];
          if (letters.indexOf(username[i]) > -1){
            continue;
          }
          letters.push(letter);
          count = username.split(letter).length -1;
          console.log(letter + ": " + count)
          $('#userCharCount .results').append("<p>"+letter + " = " + count +"</p>");
        }
    },

    addRegistrant: function(username) {
        var d = new Date();
        $('#regHistory .results').append("<p>"+username + ": " + d+"</p>");
    }


});

    var registrantList = new RegistrantList;




$(document).ready(function() {
    var registration = new RegistrationView;
});
