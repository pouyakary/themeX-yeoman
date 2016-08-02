'use strict';
import yeoman = require('yeoman-generator');
import chalk = require('chalk');
import yosay = require('yosay');

export = yeoman.Base.extend({
    prompting: ( ) => {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the badass ' + chalk.red('generator-themex') + ' generator!'
        ));

        var prompts = [{
            type: 'confirm',
            name: 'someAnswer',
            message: 'Would you like to enable this option?',
            default: true
        }];

        return this.prompt(prompts).then(function (props) {
            // To access props later use this.props.someAnswer;
            this.props = props;
        }.bind(this));
    },

  writing: ( ) => {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
