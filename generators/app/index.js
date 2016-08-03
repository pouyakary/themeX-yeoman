
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
    var yaml    = require('js-yaml');
    var uuid    = require('uuid');

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    var modes = [
        'A light theme',
        'A dark theme',
        'Both light and dark themes'
    ];

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
            choices: modes
        }
    ];

    const colorPlaceholder = 'yeoman-themeX-color-placeholder';
    const variablePlaceholder = 'yeoman-themeX-var-placeholder';

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

                // Travis CI test tools...
                this.fs.copyTpl(
                    this.templatePath('package.json'),
                    this.destinationPath('package.json'),
                    { name: this.props.filename }
                );

                this.fs.copy(
                    this.templatePath('travis.yml'),
                    this.destinationPath('.travis.yml')
                )

                // main theme...
                this.fs.copyTpl(
                    this.templatePath('theme.yml'),
                    this.destinationPath(
                        this.props.filename + path.join( '.themeX', 'theme.yml' )
                    ),
                    {
                        description: this.props.description,
                        author: this.props.author,
                        themes: generateThemes( this.props )
                    }
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
// ─── GENERATE THEMES ────────────────────────────────────────────────────────────
//

    function generateThemes ( props ) {
        var themes = [ ];
        let currentMode = findIndex( modes, props.mode );

        if ( currentMode === 0 ) {
            themes.push( makeThemeForMode( 0, props ) );
        } else if ( currentMode === 1 ) {
            themes.push( makeThemeForMode( 1, props ) );
        } else {
            themes.push( makeThemeForMode( 0, props ) );
            themes.push( makeThemeForMode( 1, props ) );
        }

        return composeThemesIntoYaml( themes );
    }

//
// ─── COMPOSE THEMES ─────────────────────────────────────────────────────────────
//

    function composeThemesIntoYaml ( themes ) {
        return fixYaml( yaml.safeDump( themes, {
            indent: 2
        }));
    }

//
// ─── FIX YAML ───────────────────────────────────────────────────────────────────
//

    function fixYaml ( yml ) {
        return indent( yml
            .replace( /yeoman-themeX-color-placeholder/g, '# Color' )
            .replace( /yeoman-themeX-var-placeholder/g, '# Define' )
        );
    }

//
// ─── INDENT ─────────────────────────────────────────────────────────────────────
//

    function indent ( text ) {
        return text.split('\n').map( line => `  ${ line }`).join('\n');
    }

//
// ─── FIND INDEX ─────────────────────────────────────────────────────────────────
//

    function findIndex ( array, element ) {
        for ( let index in array ) {
            if ( array[ index ] === element ) {
                return index;
            }
        }
        return 0;
    }

//
// ─── MAKE THEME FOR MODE ────────────────────────────────────────────────────────
//

    function makeThemeForMode ( mode, props ) {
        let modeText = ( mode === 0 )? 'Light' : 'Dark';
        return {
            name: `${ props.name } - ${ modeText }`,
            uuid: uuid.v4( ),
            baseColor: modeText.toLowerCase( ),
            colors: {
                color1:         variablePlaceholder,
                color2:         variablePlaceholder
            },
            settings: {
                background:     colorPlaceholder,
                caret:          colorPlaceholder,
                foreground:     colorPlaceholder,
                invisibles:     colorPlaceholder,
                lineHighlight:  colorPlaceholder,
                selection:      colorPlaceholder,
                comment:        colorPlaceholder
            }
        }
    }

// ────────────────────────────────────────────────────────────────────────────────
