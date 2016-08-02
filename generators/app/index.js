
//
// Yeoman generator for themeX
//   Copyright 2016 Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//

//
// ─── STRICT ─────────────────────────────────────────────────────────────────────
//

    'use strict';

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    var yeoman  = require('yeoman-generator');
    var colors  = require('colors');
    var yosay   = require('yosay');
    var path    = require('path');

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    let prompts = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your project?',
            default: 'My beloved theme'
        },
        {
            type: 'input',
            name: 'description',
            message: "How do you describe your theme?",
            default: 'Most beautiful scheme...'
        },
        {
            type: 'input',
            name: 'author',
            message: "Who is the author?",
            default: 'My name or my awesome organization name'
        },
        {
            type: 'input',
            name: 'filename',
            message: "What's your base file name?",
            default: 'some-name',
            validate: fileNameValidator
        },
        {
            type: 'list',
            name: 'mode',
            message: 'What starting theme modes you want?',
            choices: [
                'A dark theme',
                'A light theme',
                'Both light and dark themes'
            ]
        }
    ];

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    module.exports = yeoman.Base.extend({

        //
        // ─── PROMPTING ───────────────────────────────────────────────────
        //

            prompting: function ( ) {
                welcomeYoSay( );
                return this.prompt( prompts ).then( function ( props ) {
                    this.props = props;
                }.bind( this ));
            },

        //
        // ─── WRITING ─────────────────────────────────────────────────────
        //

            writing: function () {
                // Readme
                this.fs.copyTpl(
                    this.templatePath('README.md'),
                    this.destinationPath('README.md'),
                    { title: this.props.name }
                );

                this.fs.copyTpl(
                    this.templatePath('package.json'),
                    this.destinationPath('package.json'),
                    { name: this.props.filename }
                );

                this.fs.copy(
                    this.templatePath('travis.yml'),
                    this.destinationPath('.travis.yml')
                )

                this.fs.copyTpl(
                    this.templatePath('theme.yml'),
                    this.destinationPath(
                        path.join( this.props.filename,
                            path.join( '.themeX', 'theme.yml' )
                    )),
                    generateThemeXFile( this.props )
                );
            },

        // ─────────────────────────────────────────────────────────────────
    });

//
// ─── WELCOME YO SAY ─────────────────────────────────────────────────────────────
//

    function welcomeYoSay ( ) {
        console.log( yosay(
            'Welcome to the\n' + 'themeX theme project\n'.rainbow + 'initializer!'
        ));
    }

//
// ─── GET BASE FILE NAME ─────────────────────────────────────────────────────────
//

    function nameFixer ( name ) {
        return name.toLowerCase( ).replace( / |\/|\\/g , '-' );
    }

//
// ─── BASE FILE NAME VALIDATOR ───────────────────────────────────────────────────
//

    function fileNameValidator ( basename ) {
        return basename === nameFixer( basename )? true : nameFixer( basename );
    }

//
// ─── GENERATE THEMEX FILE ───────────────────────────────────────────────────────
//

    function generateThemeXFile ( props ) {
        return {
            description: props.description,
            author: props.author,
            themes: generateThemes( props )
        }
    }

//
// ─── GENERATE THEMES ────────────────────────────────────────────────────────────
//

    function generateThemes ( props ) {
        return props.mode.toString( );
    }

// ────────────────────────────────────────────────────────────────────────────────
